// A very simple meteor app built out from the leaderboard example

// link each template value to a db query - meteor propagates any changes to the underlying data in real time, automatically
// (note. this could perhaps be improved by reducing the number of queries and not having so many separate statements?)
Template.statusboard.projects = function () {
	return Projects.find({}, {sort: {status: 1, name: 1}});
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

Template.statusboard.selected_risk_level = function () {
	var project = Projects.findOne(Session.get("selected_project"));
	return project && project.risk_level;
};

Template.project.selected = function () {
	return Session.equals("selected_project", this._id) ? "selected" : '';
};

Template.statusboard.events = {
	// update project
	'click a.update': function () {
		Projects.update(Session.get("selected_project"), {
			name: $('#project_name_edit').val(),
			release: $('#project_release_edit').val(),
			target: parseInt($('#project_target_edit').val(), 10),
			comment: $('#project_comment_edit').val(),
			risk: $('#project_risk_edit').val(),
			risk_level: $('#project_risk_level_edit').val(),
			status: $('#project_status_edit').val()
		});

		Session.set("selected_project", null);
	},
	// remove project
	'click a.remove': function() {
		var project = Projects.findOne(Session.get("selected_project"));
		if (confirm("Delete "+project.name+"?")) {
			Projects.remove({_id: project._id})
		}
	},
	// insert a new project
	'click a.add': function () {
		var newName = $('#project_name').val();
		if (Validation.valid_name(newName)) {
			Projects.insert({
				name: newName,
				target: 0,
				status: "IN PROGRESS",
				risk_level: "SAFE"
			})
			
			var project = Projects.findOne({name: newName});
			Session.set("selected_project", project._id);
		}
	},
	// nothing is selected
	'click a.cancel': function () {
		Session.set("selected_project", null);
	}
};

// on clicking a project, update the var which stores this
Template.project.events = {
	'click': function () {
		Session.set("selected_project", this._id);
	}
};

// set the selected option for the status drop down
Handlebars.registerHelper('isStatusSelected', function(undef, optionValue) {
	var selectedStatus = Template.statusboard.selected_status();
  return selectedStatus == optionValue ? ' selected' : '';
});

// choose a colour for the status text
Handlebars.registerHelper('getStatusColor', function(selectedStatus) {
	switch (selectedStatus) {
		case "GOOD" : {
			return '#9ACD32';
		}
		break;
		case "BLOCKED" : {
			return '#EE6363';
		}
		break;
		case "IN PROGRESS" : {
			return '#7D9EC0';
		}
		break;
	}
});

// choose a colour for the risk text
Handlebars.registerHelper('getRiskColor', function(selectedRisk) {
	switch (selectedRisk) {
		case "SAFE" : {
			return '#9ACD32';
		}
		break;
		case "CONCERN" : {
		case "CONCERN" : {
			return 'orange';
		}
		break;
		case "DANGEROUS" : {
			return '#EE6363';
		}
		break;
	}
});

// set the selected option for the target drop down
Handlebars.registerHelper('isTargetSelected', function(undef, optionValue) {
	var selectedTarget = Template.statusboard.selected_target();
  return selectedTarget == optionValue ? ' selected' : '';
});

// set the selected option for the risk drop down
Handlebars.registerHelper('isRiskSelected', function(undef, optionValue) {
	var selectedRisk = Template.statusboard.selected_risk_level();
  return selectedRisk == optionValue ? ' selected' : '';
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




