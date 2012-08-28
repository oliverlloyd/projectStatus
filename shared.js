Projects = new Meteor.Collection("projects");

// On server startup, create some projects if the database is empty. Left over from the example to show where server code would go if there were any!
if (Meteor.is_server) {
	Meteor.startup(function () {
		if (Projects.find().count() === 0) {
			var names = ["DEMO PROJECT 1",
			"DEMO PROJECT 2",
			"DEMO PROJECT 3"];
			for (var i = 0; i < names.length; i++)
			Projects.insert({name: names[i], target: 100, status: "GOOD", release: "V0.1.2", comment: "Dummy comment test", risk: "It all might blow up"});
		}
	});
}
