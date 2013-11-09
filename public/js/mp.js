var Multiplayer = Object.extend({
    init : function (new_player) {
        this.new_player = new_player;
    },

    handleMessage : function (msg) {
        // Did I send this message?
        if (msg.UUID === this.UUID)
            return;

        // Get a reference to the object for the player that sent 
        // this message
        var obj = me.game.getEntityByName(msg.UUID);
        if (obj.length) {
            obj = obj[0];
        }
        else {
            var x = obj.pos && obj.pos.x || 50;
            var y = obj.pos && obj.pos.y || 50;
            obj = this.new_player(x, y);
            obj.name = msg.UUID;
        }

        // Route message
        switch (msg.action) {
        case "update":
            // Position update
            obj.pos.setV(msg.pos);
            obj.vel.setV(msg.vel);
            break;

        // TODO: Define more actions here
        }
    },

    sendMessage : function (msg) {
        // msg.UUID = this.UUID;

        //Send message
    }
});