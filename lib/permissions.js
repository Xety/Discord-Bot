var Permissions = function () {};

Permissions.prototype.isAllowed = function (user, permission) {
    var roles = user.roles;

    var hasPermission = false;

    for(i = 0; i < roles.length; i++) {
        if (roles[i].name === permission) {
            hasPermission = true;

            return hasPermission;
        }
    }

    return hasPermission;
};

module.exports = new Permissions();
