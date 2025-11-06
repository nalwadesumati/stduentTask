const cl = console.log;


const stdForm = document.getElementById("stdForm");
const studentContainer = document.getElementById("studentContainer");

const fnameCntrl = document.getElementById("fname");
const lnameCntrl = document.getElementById("lname");
const emailCntrl = document.getElementById("email");
const contactCntrl = document.getElementById("contact");

const submitDataBtn = document.getElementById("submitDataBtn");
const updateDataBtn = document.getElementById("updateDataBtn");



let stdArr;
if (localStorage.getItem("stdArr")) {
    stdArr = JSON.parse(localStorage.getItem("stdArr"));
} else {
    stdArr = [];
}
cl(stdArr)


const uuid = () => {
    return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    })
};

const createStdArr = (arr) => {
    let result = "";
    arr.forEach((std, i) => {
        result += `
      <tr id="${std.stdId}">
        <td>${i + 1}</td>
        <td>${std.fname}</td>
        <td>${std.lname}</td>
        <td>${std.email}</td>
        <td>${std.contact}</td>
        <td><i class="fa-solid fa-pen-to-square text-success" onclick="onEdit(this)"></i></td>
        <td><i class="fa-solid fa-trash text-danger" onclick="onRemove(this)"></i></td>
      </tr>`;
    });
    studentContainer.innerHTML = result;
};
createStdArr(stdArr);



let EDIT_ID;
const onEdit = (ele) => {
    EDIT_ID = ele.closest('tr').id;
    localStorage.setItem("EDIT_ID", EDIT_ID)
    cl(EDIT_ID);


    let EDIT_OBJ = stdArr.find(st => st.stdId === EDIT_ID)
    cl(EDIT_OBJ)

    fnameCntrl.value = EDIT_OBJ.fname;
    lnameCntrl.value = EDIT_OBJ.lname;
    emailCntrl.value = EDIT_OBJ.email;
    contactCntrl.value = EDIT_OBJ.contact;

    updateDataBtn.classList.remove("d-none")
    submitDataBtn.classList.add("d-none")
}

const onRemove = (ele) => {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let REMOVE_ID = ele.closest('tr').id
            cl(REMOVE_ID);

            //remove object form array
            let getIndex = stdArr.findIndex(std => std.stdId === REMOVE_ID)
            cl(getIndex)

            stdArr.splice(getIndex, 1)

            //update array in ls
            localStorage.setItem("stdArr", JSON.stringify(stdArr));

            //remove from ui
            ele.closest("tr").remove();

            Swal.fire({
                title: "Removed!",
                text: "Data deleted Siccessfully!!!",
                timer: 3000,
                icon: "success"
            })
        }
    });
}



const OnSubmit = eve => {
    eve.preventDefault();

    let stdobj = {
        fname: fnameCntrl.value,
        lname: lnameCntrl.value,
        email: emailCntrl.value,
        contact: contactCntrl.value,
        stdId: uuid(),


    }
    cl(stdobj);
    stdForm.reset();
    stdArr.push(stdobj);

    localStorage.setItem("stdArr", JSON.stringify(stdArr));

    let tr = document.createElement("tr");
    tr.id = stdobj.stdId;

    tr.innerHTML = `
    
                                <td>${stdArr.length}</td>
                                <td>${stdobj.fname}</td>
                                <td>${stdobj.lname}</td>
                                <td>${stdobj.email}</td>
                                <td>${stdobj.contact}</td>
                                <td><i class="fa-solid fa-pen-to-square text-success" onclick="onEdit(this)"></i></td>
                                <td><i class="fa-solid fa-trash text-danger" onClick="onRemove(this)"></i></td>
                                `
    studentContainer.append(tr);

    Swal.fire({
        title: "Data Added Successfully!!!",
        timer: 3000,
        icon: "success",

    })
}


const OnUpdate = () => {
    //update id

    let UPDATED_ID = localStorage.getItem("EDIT_ID");
    cl(UPDATED_ID);

    let UPDATE_OBJ = {
        fname: fnameCntrl.value,
        lname: lnameCntrl.value,
        email: emailCntrl.value,
        contact: contactCntrl.value,
        stdId: UPDATED_ID
    }
    cl(UPDATE_OBJ);
    stdForm.reset();

    ///updated in array

    let getIndex = stdArr.findIndex(std => std.stdId === UPDATED_ID);
    cl(getIndex);
    stdArr[getIndex] = UPDATE_OBJ

    //update in ls
    localStorage.setItem("stdArr", JSON.stringify(stdArr));

    updateDataBtn.classList.add("d-none");
    submitDataBtn.classList.remove("d-none")

    Swal.fire({
        title: "Updated",
        text: "Updated Successfully!!!",
        icon: "success",
        timer: 3000,
        confirmButtonColor: "#808080",
    })
    createStdArr(stdArr);
    localStorage.removeItem("EDIT_ID");
}






updateDataBtn.addEventListener("click", OnUpdate);
stdForm.addEventListener("submit", OnSubmit);
