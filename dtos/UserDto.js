import AddressDto from "./AddressDto.js";

export default class UserDto {
    id;
    roles;
    isActivated;
    fullName;
    email;
    phone;
    address;

    constructor(model) {
        this.fullName = model.fullName
        this.email = model.email
        this.id = model._id
        this.roles = model.roles
        this.isActivated = model.isActivated
        this.phone = model.phone;
        this.address = {...new AddressDto(model.address)}
    }

}