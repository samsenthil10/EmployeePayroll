class EmployeePayrollData {

    get id() {
        return this._id;
    }

    set id(id) {
        let idRegex = RegExp('[1-9]{1}[0-9]*');
        if (idRegex.test(id))
            this._id = id;
        else {
            throw "Id is Incorrect!"
        }

    }

    get name() {
        return this._name;
    }

    set name(name) {
        let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z ]{2,}$');
        if (nameRegex.test(name))
            this._name = name;
        else {
            throw "Name Is Incorrect!"
        }

    }

    get profilePic() {
        return this._profilePic;
    }

    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }

    get gender() {
        return this._gender;
    }

    set gender(gender) {
        this._gender = gender;
    }

    get department() {
        return this._department;
    }

    set department(department) {
        this._department = department;
    }

    get salary() {
        return this._salary;
    }

    set salary(salary) {
        this._salary = salary;
    }

    get note() {
        return this._note;
    }

    set note(note) {
        this._note = note;
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(startDate) {

        startDate = new Date(startDate)
        var now = new Date();
        var maximumPossibleDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
        var end = now;
        if (!(startDate > now)) {
            if (startDate >= maximumPossibleDate && startDate <= end) {
                this._startDate = startDate;
            } else {
                throw "Start Date Should Be Less Than 30 Days From Joining!";
            }
        } else {
            throw "Start Date Cannot Be Future Date";
        }

    }


    toString() {
        const format = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = this.startDate === undefined ? "undefined" :
            this.startDate.toLocaleDateString("en-US", format);
        return "Name = " + this.name + ", Gender = " + this.gender + ", ProfilePic = \"" + this.profilePic + "\", Department = [" + this.department + "], Salary = " + this.salary +
            ", StartDate = " + date + ", Note = \"" + this.note + "\"";
    }
}