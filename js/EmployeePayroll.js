class EmployeePayRollData {


    errorFlag = 0;
    errorMessage = "";

    get id() {
        return this._id;
    }

    set id(id) {
        let idRegex = RegExp('[1-9]{1}[0-9]*');
        if (idRegex.test(id))
            this._id = id;
        else {
            this.errorFlag = 1;
            this.errorMessage = this.errorMessage + "\n" + "ID is Incorrect!";
        }

    }

    get name() {
        return this._name;
    }

    set name(name) {
        let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
        if (nameRegex.test(name))
            this._name = name;
        else {
            this.errorFlag = 1;
            this.errorMessage = this.errorMessage + "\n" + "Name is Incorrect!";
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
        let maxOldDate = new Date(new Date().setDate(new Date().getDate() - 30));
        console.log(maxOldDate, startDate);
        if (startDate <= new Date() && startDate >= maxOldDate) {
            this._startDate = startDate;
        } else {
            if (this.errorFlag == 1) {
                alert(this.errorMessage + "\n" + "Start Date is invalid - Should not be a future date or 30 days before!");
            } else {
                this.errorFlag = 2;
                alert("Start Date is invalid - Should not be a future date or 30 days before!");
            }
            throw ("Start Date is Incorrect!");
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