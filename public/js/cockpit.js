(function(window, document) {
        
    var hostname = document.location.hostname ? document.location.hostname : "localhost";

    var Cockpit = function Cockpit() {
        this.socket = io.connect('http://' + hostname);
        this.loadPlugins();

        // Fullscreen on doubleclick
        $("#glasspane").dblclick(function(ev) {
            ev.preventDefault();
            $(document).toggleFullScreen();
            return false;
        });
    };

    Cockpit.prototype.loadPlugins = function loadPlugins() {
        var cockpit = this;
        Cockpit.plugins.forEach(function(plugin) {
            new plugin(cockpit);
        });
    };

    // Static array containing all plugins to load
    Cockpit.plugins = [];

    window.Cockpit = Cockpit;
}(window, document));
