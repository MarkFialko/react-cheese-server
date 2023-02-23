export default class AddressDto {
    country;
    street;
    city;

    constructor(model) {
        this.country = model.country
        this.street = model.street
        this.city = model.city
    }

}