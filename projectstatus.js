// Set up a collection to contain project information. On the server,
// it is backed by a MongoDB collection named "projects."

Projects = new Meteor.Collection("projects");

if (Meteor.is_client) {
	Template.statusboard.projects = function () {
		return Projects.find({}, {sort: {score: -1, name: 1}});
	};

	Template.statusboard.selected_name = function () {
		var project = Projects.findOne(Session.get("selected_project"));
		return project && project.name;
	};

	Template.statusboard.selected_status = function () {
		var project = Projects.findOne(Session.get("selected_project"));
		return project && project.status;
	};

	Template.statusboard.selected_release = function () {
		var project = Projects.findOne(Session.get("selected_project"));
		return project && project.release;
	};
	
	Template.statusboard.selected_target = function () {
		var project = Projects.findOne(Session.get("selected_project"));
		return project && project.target;
	};

	Template.statusboard.selected_comment = function () {
		var project = Projects.findOne(Session.get("selected_project"));
		return project && project.comment;
	};

	Template.statusboard.selected_risk = function () {
		var project = Projects.findOne(Session.get("selected_project"));
		return project && project.risk;
	};
	
	Template.project.selected = function () {
		//console.log(this)
		//if (this.status == "GOOD") {
		//	console.log ('GOOD');
		//}
		
		return Session.equals("selected_project", this._id) ? "selected" : '';
	};
	

	Template.statusboard.events = {
		'click input.update': function () {
			Projects.update(Session.get("selected_project"), {
				name: $('#project_name_edit').val(),
				release: $('#project_release_edit').val(),
				target: $('#project_target_edit').val(),
				comment: $('#project_comment_edit').val(),
				risk: $('#project_risk_edit').val(),
				status: $('#project_status_edit').val()
			});

			Session.set("selected_project", null);
		},
		'click input.remove': function() {
			var project = Projects.findOne(Session.get("selected_project"));
			Projects.remove({_id: project._id})
		},
		'click input.add': function () {
			var newName = $('#project_name').val();
			if (Validation.valid_name(newName)) {
				Projects.insert({
					name: newName
				})
				
				var project = Projects.findOne({name: newName});
				
				Session.set("selected_project", project._id);
			}
		},
		'click input.cancel': function () {
			Session.set("selected_project", null);
		}
	};

	Template.project.events = {
		'click': function () {
			Session.set("selected_project", this._id);
		}
	};
	
	var selectedStatus = Template.statusboard.selected_status;
	Handlebars.registerHelper('isStatusSelected', function(selectedStatus, optionValue) {
	  return selectedStatus == optionValue ? ' selected' : '';
	});
	
	// not currently used
	Handlebars.registerHelper('getStatusColor', function(selectedStatus) {
		switch (selectedStatus) {
			case "GOOD" : {
				return 'green';
			}
			break;
			case "BAD" : {
				return 'orange';
			}
			break;
			case "UGLY" : {
				return 'red';
			}
			break;
			case "IN PROGRESS" : {
				return 'blue';
			}
			break;
		}
	});
	
	var selectedTarget = Template.statusboard.selected_target;
	Handlebars.registerHelper('isTargetSelected', function(selectedTarget, optionValue) {
	  return selectedTarget == optionValue ? ' selected' : '';
	});

	Validation = {
		clear: function () { 
			return Session.set("error", undefined); 
		},
		set_error: function (message) {
			return Session.set("error", message);
		},
		valid_name: function (name) {
			this.clear();
			if (name.length == 0) {
				this.set_error("Name can't be blank");
				return false;
			} else if (this.project_exists(name)) {
				this.set_error("Project already exists");
				return false;
			} else {
				return true;
			}
		},
		project_exists: function(name) {
			return Projects.findOne({name: name});
		}
	};
};

// On server startup, create some projects if the database is empty.
if (Meteor.is_server) {
	Meteor.startup(function () {
		if (Projects.find().count() === 0) {
			var names = ["DEMO ACS",
			"DEMO CRM",
			"DEMO DRT"];
			for (var i = 0; i < names.length; i++)
			Projects.insert({name: names[i], score: Math.floor(Math.random()*10)*5, status: "OK"});
		}
	});
}

