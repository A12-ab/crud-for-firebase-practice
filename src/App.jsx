import { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css'
import firebaseConfigApp from "./utils/firebase-config";
import { getFirestore, addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2';
const db = getFirestore(firebaseConfigApp);
const App = ()=>{

  const model = {
    employeeName: '',
    salary: '',
    joiningDate: ''
  }

  const [employees, setEmployees] = useState(model)
  const [isEmpty, setIsEmpty] = useState(false);
  const [employeeData, setEmployeeData] = useState([])
  const [isUpdated, setIsUpdated] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(()=>{
    const req = async()=>{
      const snapshot = await getDocs(collection(db, "employees"))
      setIsEmpty(snapshot.empty);
      let tmp = []
      snapshot.forEach((doc)=>{
        const documents = doc.data()
        documents.uid = doc.id
        tmp.push(documents);
      })
      console.log(tmp)
      setEmployeeData(tmp);
      

    }
    req();
  },[isEmpty, isUpdated])

  const handleChange = (e)=>{
     const input = e.target
     const name = input.name
     const value = input.value 
     setEmployees({
      ...employees,
      [name]:value
     })

  }

  const createEmployee = async(e)=>{
    try{
      e.preventDefault()
      await addDoc(collection(db, "employees"), employees)
      setIsEmpty(false)
      setIsUpdated(!isUpdated);
      new Swal({
        icon: 'success',
        title: 'Employee created'
      })
    }
    catch(err)
    {
      new Swal({
        icon: 'error',
        title: 'Failed !',
        text: err.message
      })
    }
    finally{
      setEmployees(model)
    }
  }

  const deleteEmployee = async(uid)=>{
    const ref = doc(db, "employees", uid);
    await deleteDoc(ref);
    setIsUpdated(!isUpdated)
  }

  const editEmployee = (item)=>{
    setEdit(item);
    setEmployees(item)
  }

  const saveEmployee =async(e)=>{
    e.preventDefault();
    const ref = doc(db, "employees", edit.uid)
    await updateDoc(ref, employees)
    setEdit(null)
    setEmployees(model)
    setIsUpdated(!isUpdated)
  }
  return(
    <div className="flex flex-col items-center gap-16">
      <h1 className="text-5xl font-bold">CodingOtt <span className="text-indigo-600">CRUD</span></h1>
      <div className="grid grid-cols-2 w-11/12 gap-16">
        <div className="w-[400px]">
          <form className="space-y-6" onSubmit={ edit ? saveEmployee : createEmployee}>
            <div className="flex flex-col">
              <label className="font-semibold text-lg mb-2">Employee Name</label>
              <input 
                onChange={handleChange}
                required
                type="text"
                name="employeeName"
                className="p-3 rounded border border-gray-300"
                placeholder="Employee name"
                value={employees.employeeName}
                
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-lg mb-2">Salary</label>
              <input 
                onChange={handleChange}
                type="number"
                required
                name="salary"
                className="p-3 rounded border border-gray-300"
                placeholder="Salary"
                value={employees.salary}
               
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-lg mb-2">Joining Date</label>
              <input 
                onChange={handleChange}
                type="date"
                required
                name="joiningDate"
                className="p-3 rounded border border-gray-300"
                value={employees.joiningDate}
                
              />
            </div>
            {
              edit ? <button className="bg-rose-500 px-6 py-3 rounded font-semibold text-white">SAVE</button>
              :
              <button className="bg-green-500 px-6 py-3 rounded font-semibold text-white">CREATE</button>
            }

            
            
          </form>
        </div>
        <div className="flex-1">
          {
            isEmpty && 
            <div className="flex flex-col items-center">
              <i className="ri-u-disk-line text-3xl text-gray-500"></i>
              <h1 className="text-3xl text-gray-500">Empty</h1>
            </div>
          }
          <h1 className="text-2xl font-semibold">Employees</h1>
          <table className="w-full mt-8">
            <thead>
              <tr className="bg-rose-600 text-white text-left">
                <th className="py-2 pl-1">S/No</th>
                <th>Employee Name</th>
                <th>Salary</th>
                <th>Joining Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                employeeData.map((item,index)=>(
                  <tr key={index} className="border-b border-gray-300">
                    <td className="pl-2 py-2">{index+1}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.salary}</td>
                    <td>{item.joiningDate}</td>
                    <td>
                      <div className="space-x-2">
                        <button className="w-8 h-8 bg-indigo-600 text-white rounded-full" onClick={()=>editEmployee(item)}>
                           <i className="ri-edit-line"></i>
                        </button>
                        <button className="w-8 h-8 bg-rose-600 text-white rounded-full" onClick={()=>deleteEmployee(item.uid)}>
                            <i className="ri-delete-bin-line"></i> 
                        </button>
                      </div>
                    </td>
                  </tr>

                ))
              }
              
            </tbody>
          </table>
        </div>
      </div>
    </div>

  )
}
export default App;