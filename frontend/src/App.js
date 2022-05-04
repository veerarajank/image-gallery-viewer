import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
export default function App () {
  const [upload, setUpload] = useState([])
  const [viewer, setViewer] = useState([])
  const [selected, setSelected] = useState([])

  // managing files in state
  const uploadMultipleFiles = (e) => setUpload(e.target.files)

  // send post api request with state managing images
  const uploadFiles = () => {
    for (const key of Object.keys(upload)) {
      const formData = new FormData()
      formData.append('imgCollection', upload[key])
      axios.post(process.env.REACT_APP_SERVER_URL + '/api/upload-images', formData, {
      })
    }
    retriveValue()
  }

  // managing state with selected checkbox values
  const selectValue = (id) => {
    console.log(selected)
    if (selected.includes(id)) {
      setSelected(selected.filter(value => value !== id))
    } else {
      setSelected(prevState => [...prevState, id])
    }
  }

  // get all values via the api
  const retriveValue = () => {
    axios.get(process.env.REACT_APP_SERVER_URL + '/api').then(res => {
      setViewer(Object.values(res.data.users))
    })
  }

  // delete or archive the selected values via api
  // flag 1 - Delete 2- Archive
  const deleteArchiveValues = (flag) => {
    let url = ''
    if (flag === 1) {
      url = '/api/delete?id='
    } else if (flag === 2) {
      url = '/api/archive?id='
    }
    selected.forEach(value => axios.get(process.env.REACT_APP_SERVER_URL + url + value).then(_res =>
      setSelected(selected.filter(record => record !== value))
    ))
  }

  // while load the page get all values from the DB via api
  useEffect(() => retriveValue(), [])

  return (
    <form className='container'>
      <div className="upload">
          <div className='upload-border'>
            <input id="uploadMultipleFiles" type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
            <button className="btn-upload" onClick={uploadFiles}>Upload</button>
          </div>
          <div className='upload-border'>
            <button className="btn-upload" onClick={() => deleteArchiveValues(1)}>Delete</button>
            <button className="btn-upload" onClick={() => deleteArchiveValues(2)}>Archive</button>
          </div>
      </div>
      <div className="viewer">
          {viewer.map((collection, index) => (
            <div key={index}>
              <img src={collection.imgCollection} alt="..." height='200px' width='200px' />
              <input type='checkbox' onChange={() => selectValue(collection._id)} />
            </div>
          ))}
        </div>
    </form >
  )
}
