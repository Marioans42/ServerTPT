

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        label: DataTypes.STRING,
        value: DataTypes.INTEGER
    });
    
    return Role;
}