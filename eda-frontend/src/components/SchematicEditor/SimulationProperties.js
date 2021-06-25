/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
  List,
  Checkbox,
  ListItem,
  Button,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Select,
  Divider,
  Popover,
  Tooltip,
  IconButton
} from '@material-ui/core'
import queryString from 'query-string'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { setControlLine, setControlBlock, setResultTitle, setResultGraph, setResultText, setNetlist } from '../../redux/actions/index'
import { GenerateNetList, GenerateNodeList, GenerateCompList } from './Helper/ToolbarTools'
import SimulationScreen from '../Shared/SimulationScreen'
import { Multiselect } from 'multiselect-react-dropdown'

import api from '../../utils/Api'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: '90px'
  },
  pages: {
    margin: theme.spacing(0, 1)
  },
  propertiesBox: {
    width: '100%'
  },
  simulationOptions: {
    margin: '0px',
    padding: '0px',
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}))

export default function SimulationProperties () {
  const netfile = useSelector(state => state.netlistReducer)
  const isSimRes = useSelector(state => state.simulationReducer.isSimRes)
  const [taskId, setTaskId] = useState(null)
  const dispatch = useDispatch()
  const classes = useStyles()
  const [nodeList, setNodeList] = useState([])
  const [componentsList, setComponentsList] = useState([])
  const [dcSweepcontrolLine, setDcSweepControlLine] = useState({
    parameter: '',
    sweepType: 'Linear',
    start: '',
    stop: '',
    step: '',
    parameter2: '',
    start2: '',
    stop2: '',
    step2: ''
  })
  const [transientAnalysisControlLine, setTransientAnalysisControlLine] = useState({
    start: '',
    stop: '',
    step: '',
    skipInitial: false
  })

  const [acAnalysisControlLine, setAcAnalysisControlLine] = useState({
    input: 'dec',
    start: '',
    stop: '',
    pointsBydecade: ''
  })

  const [tfAnalysisControlLine, setTfAnalysisControlLine] = useState({
    outputNodes: false,
    outputVoltageSource: '',
    inputVoltageSource: ''
  })

  const [controlBlockParam, setControlBlockParam] = useState('')
  const [disabled, setDisabled] = React.useState(false)
  const [simType, setSimType] = React.useState('')
  var typeSimulation = ''
  const handleControlBlockParam = (evt) => {
    setControlBlockParam(evt.target.value)
  }
  var analysisNodeArray = []; var analysisCompArray = []; var nodeArray = []
  const pushZero = (nodeArray) => {
    nodeArray.push({ key: 0 })
  }
  const onDcSweepTabExpand = () => {
    try {
      setComponentsList(['', ...GenerateCompList()])
      setNodeList(['', ...GenerateNodeList()])
    } catch (err) {
      setComponentsList([])
      setNodeList([])
      alert('Circuit not complete. Please Check Connectons.')
    }
  }
  const onTransientAnalysisTabExpand = () => {
    try {
      setComponentsList(['', ...GenerateCompList()])
      setNodeList(['', ...GenerateNodeList()])
    } catch (err) {
      setComponentsList([])
      setNodeList([])
      alert('Circuit not complete. Please Check Connectons.')
    }
  }

  const onTFTabExpand = () => {
    try {
      setComponentsList(['', ...GenerateCompList()])
      setNodeList(['', ...GenerateNodeList()])
    } catch (err) {
      setComponentsList([])
      setNodeList([])
      alert('Circuit not complete. Please Check Connectons.')
    }
  }

  const handleDcSweepControlLine = (evt) => {
    const value = evt.target.value

    setDcSweepControlLine({
      ...dcSweepcontrolLine,
      [evt.target.id]: value
    })
  }

  const handleTransientAnalysisControlLine = (evt) => {
    const value = evt.target.value

    setTransientAnalysisControlLine({
      ...transientAnalysisControlLine,
      [evt.target.id]: value
    })
  }
  const handleTransientAnalysisControlLineUIC = (evt) => {
    const value = evt.target.checked

    setTransientAnalysisControlLine({
      ...transientAnalysisControlLine,
      [evt.target.id]: value
    })
  }

  const handleAcAnalysisControlLine = (evt) => {
    const value = evt.target.value

    setAcAnalysisControlLine({
      ...acAnalysisControlLine,
      [evt.target.id]: value
    })
  }

  const handleTfAnalysisControlLine = (evt) => {
    const value = evt.target.value
    setTfAnalysisControlLine({
      ...tfAnalysisControlLine,
      [evt.target.id]: value
    })
  }
  const handleTfAnalysisControlLineNodes = (evt) => {
    const value = evt.target.checked
    setTfAnalysisControlLine({
      ...tfAnalysisControlLine,
      [evt.target.id]: value
    })
    setDisabled(tfAnalysisControlLine.outputNodes)
  }

  const [simulateOpen, setSimulateOpen] = React.useState(false)
  const handlesimulateOpen = () => {
    setSimulateOpen(true)
  }

  const handleSimulateClose = () => {
    setSimulateOpen(false)
  }
  const [simResult, setSimResult] = React.useState({})

  const handleSimulationResult = (simResults) => {
    setSimResult(simResults)
  }

  const acTypeOptionList = {
    Linear: 'lin',
    Decade: 'dec',
    Octave: 'oct'
  }
  let [selectedValue, setSelectedValue] = React.useState([])
  let [selectedValueDCSweep, setSelectedValueDCSweep] = React.useState([])
  let [selectedValueTransientAnal, setSelectedValueTransientAnal] = React.useState([])
  let [selectedValueTFAnal, setSelectedValueTFAnal] = React.useState([])
  let [selectedValueComp, setSelectedValueComp] = React.useState([])
  let [selectedValueDCSweepComp, setSelectedValueDCSweepComp] = React.useState([])
  let [selectedValueTransientAnalComp, setSelectedValueTransientAnalComp] = React.useState([])

  const handleAddSelectedValueDCSweep = (data) => {
    var f = 0
    selectedValueDCSweep.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key === data) f = 1
      }
    })
    if (f === 0) {
      const tmp = [...selectedValueDCSweep, data]
      setSelectedValueDCSweep(tmp)
    }
    // console.log(selectedValue)
  }
  const handleRemSelectedValueDCSweep = (data) => {
    const tmp = []
    selectedValueDCSweep.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key !== data) tmp.push(data)
      }
    })
    selectedValueDCSweep = tmp
    // console.log(selectedValue)
  }
  const handleAddSelectedValueTransientAnal = (data) => {
    var f = 0
    selectedValueTransientAnal.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key === data) f = 1
      }
    })
    if (f === 0) {
      const tmp = [...selectedValueTransientAnal, data]
      setSelectedValueTransientAnal(tmp)
    }
    // console.log(selectedValue)
  }
  const handleRemSelectedValueTransientAnal = (data) => {
    const tmp = []
    selectedValueTransientAnal.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key !== data) tmp.push(data)
      }
    })
    selectedValueTransientAnal = tmp
    // console.log(selectedValue)
  }
  const handleAddSelectedValueTFAnal = (data) => {
    var f = 0
    selectedValueTFAnal.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key === data) f = 1
      }
    })
    if (f === 0) {
      const tmp = [...selectedValueTFAnal, data]
      setSelectedValueTFAnal(tmp)
    }
    // console.log(selectedValue)
  }
  const handleRemSelectedValueTFAnal = (data) => {
    const tmp = []
    selectedValueTFAnal.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key !== data) tmp.push(data)
      }
    })
    selectedValueTFAnal = tmp
    // console.log(selectedValue)
  }
  const handleAddSelectedValueDCSweepComp = (data) => {
    var f = 0
    selectedValueDCSweepComp.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key === data) f = 1
      }
    })
    if (f === 0) {
      const tmp = [...selectedValueDCSweepComp, data]
      setSelectedValueDCSweepComp(tmp)
    }
    // console.log(selectedValue)
  }
  const handleRemSelectedValueDCSweepComp = (data) => {
    const tmp = []
    selectedValueDCSweepComp.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key !== data) tmp.push(data)
      }
    })
    selectedValueDCSweepComp = tmp
    // console.log(selectedValue)
  }
  const handleAddSelectedValueTransientAnalComp = (data) => {
    var f = 0
    selectedValueTransientAnalComp.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key === data) f = 1
      }
    })
    if (f === 0) {
      const tmp = [...selectedValueTransientAnalComp, data]
      setSelectedValueTransientAnalComp(tmp)
    }
    // console.log(selectedValue)
  }
  const handleRemSelectedValueTransientAnalComp = (data) => {
    const tmp = []
    selectedValueTransientAnalComp.forEach((value, i) => {
      if (value[i] !== undefined) {
        if (value[i].key !== data) tmp.push(data)
      }
    })
    selectedValueTransientAnalComp = tmp
    // console.log(selectedValue)
  }

  // Prepare Netlist to file
  const prepareNetlist = (netlist) => {
    var titleA = netfile.title.split(' ')[1]
    var myblob = new Blob([netlist], {
      type: 'text/plain'
    })
    var file = new File([myblob], `${titleA}.cir`, { type: 'text/plain', lastModified: Date.now() })
    // console.log(file)
    sendNetlist(file)
  }

  function sendNetlist (file) {
    setIsResult(false)
    netlistConfig(file)
      .then((response) => {
        const res = response.data
        const getUrl = 'simulation/status/'.concat(res.details.task_id)
        setTaskId(res.details.task_id)
        simulationResult(getUrl)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  // Upload the nelist
  function netlistConfig (file) {
    const token = localStorage.getItem('esim_token')
    var url = queryString.parse(window.location.href.split('editor?')[1])
    const formData = new FormData()
    formData.append('file', file)
    formData.append('simulationType', typeSimulation)
    console.log(url.id)
    if(url.id){
      formData.append('save_id', url.id)
    }
    console.log(formData)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    setSimType(typeSimulation)
    return api.post('simulation/upload', formData, config)
  }

  const [isResult, setIsResult] = useState(false)

  // Get the simulation result with task_Id
  function simulationResult (url) {
    api
      .get(url)
      .then((res) => {
        if (res.data.state === 'PROGRESS' || res.data.state === 'PENDING') {
          setTimeout(simulationResult(url), 1000)
        } else {
          var result = res.data.details
          if (result === null) {
            setIsResult(false)
          } else {
            var temp = res.data.details.data
            var data = result.data
            // console.log('DATA SIm', data)
            if (res.data.details.graph === 'true') {
              var simResultGraph = { labels: [], x_points: [], y_points: [] }
              // populate the labels
              for (var i = 0; i < data.length; i++) {
                simResultGraph.labels[0] = data[i].labels[0]
                var lab = data[i].labels
                // lab is an array containeing labels names ['time','abc','def']
                simResultGraph.x_points = data[0].x

                // labels
                for (var x = 1; x < lab.length; x++) {
                //   if (lab[x].includes('#branch')) {
                //     lab[x] = `I (${lab[x].replace('#branch', '')})`
                //   }
                //  uncomment below if you want label like V(r1.1) but it will break the graph showing time as well
                //  else {
                // lab[x] = `V (${lab[x]})`

                  // }
                  simResultGraph.labels.push(lab[x])
                }
                // populate y_points
                for (var z = 0; z < data[i].y.length; z++) {
                  simResultGraph.y_points.push(data[i].y[z])
                }
              }

              simResultGraph.x_points = simResultGraph.x_points.map(d => parseFloat(d))

              for (let i1 = 0; i1 < simResultGraph.y_points.length; i1++) {
                simResultGraph.y_points[i1] = simResultGraph.y_points[i1].map(d => parseFloat(d))
              }

              dispatch(setResultGraph(simResultGraph))
            } else {
              var simResultText = []
              for (let i = 0; i < temp.length; i++) {
                let postfixUnit = ''
                if (temp[i][0].includes('#branch')) {
                  postfixUnit = 'A'
                } else if (temp[i][0].includes('transfer_function')) {
                  postfixUnit = ''
                } else if (temp[i][0].includes('impedance')) {
                  postfixUnit = 'Ohm'
                } else {
                  temp[i][0] = `V(${temp[i][0]})`
                  postfixUnit = 'V'
                }

                simResultText.push(temp[i][0] + ' ' + temp[i][1] + ' ' + parseFloat(temp[i][2]) + ' ' + postfixUnit + '\n')
              }

              handleSimulationResult(res.data.details)
              dispatch(setResultText(simResultText))
            }
            setIsResult(true)
          }
        }
      })
      .then((res) => { handlesimulateOpen() })
      .catch(function (error) {
        console.log(error)
      })
  }

  const startSimulate = (type) => {
    var compNetlist = GenerateNetList()
    var controlLine = ''
    var controlBlock = ''
    var skipMultiNodeChk = 0
    var nodes = ''
    switch (type) {
      case 'DcSolver':
        // console.log('To be implemented')
        typeSimulation = 'DcSolver'
        controlLine = '.op'

        dispatch(setResultTitle('DC Solver Output'))
        break
      case 'DcSweep':
        // console.log(dcSweepcontrolLine)
        typeSimulation = 'DcSweep'
        controlLine = `.dc ${dcSweepcontrolLine.parameter} ${dcSweepcontrolLine.start} ${dcSweepcontrolLine.stop} ${dcSweepcontrolLine.step} ${dcSweepcontrolLine.parameter2} ${dcSweepcontrolLine.start2} ${dcSweepcontrolLine.stop2} ${dcSweepcontrolLine.step2}`
        dispatch(setResultTitle('DC Sweep Output'))
        selectedValue = selectedValueDCSweep
        selectedValueComp = selectedValueDCSweepComp
        break
      case 'Transient':
        typeSimulation = 'Transient'
        // console.log(transientAnalysisControlLine)
        var uic = ''
        if (transientAnalysisControlLine.skipInitial === true) uic = 'UIC'
        controlLine = `.tran ${transientAnalysisControlLine.step} ${transientAnalysisControlLine.stop} ${transientAnalysisControlLine.start} ${uic}`

        dispatch(setResultTitle('Transient Analysis Output'))
        selectedValue = selectedValueTransientAnal
        selectedValueComp = selectedValueTransientAnalComp
        break
      case 'Ac':
        // console.log(acAnalysisControlLine)
        typeSimulation = 'Ac'
        controlLine = `.ac ${acAnalysisControlLine.input} ${acAnalysisControlLine.pointsBydecade} ${acAnalysisControlLine.start} ${acAnalysisControlLine.stop}`

        dispatch(setResultTitle('AC Analysis Output'))
        break

      case 'tfAnalysis':
        typeSimulation = 'tfAnalysis'
        selectedValue = selectedValueTFAnal
        if (tfAnalysisControlLine.outputNodes === true) {
          selectedValue.forEach((value, i) => {
            if (value[i] !== undefined) {
              nodes = nodes + ' ' + String(value[i].key)
            }
          })
          nodes = 'V(' + nodes + ')'
        } else {
          nodes = `I(${tfAnalysisControlLine.outputVoltageSource})`
        }
        console.log(tfAnalysisControlLine.outputNodes)
        controlLine = `.tf ${nodes} ${tfAnalysisControlLine.inputVoltageSource}`

        dispatch(setResultTitle('Transfer Function Analysis Output'))
        skipMultiNodeChk = 1
        break
      default:
        break
    }
    // console.log(selectedValue)
    var atleastOne = 0
    let cblockline = ''
    // if either the extra expression field or the nodes multi select
    // drop down list in enabled then atleast one value is made non zero
    // to add add all instead to the print statement.
    if (selectedValue.length > 0 && selectedValue !== null && skipMultiNodeChk === 0) {
      selectedValue.forEach((value, i) => {
        if (value[i] !== undefined && value[i].key !== 0) {
          atleastOne = 1
          cblockline = cblockline + ' ' + String(value[i].key)
        }
      })
    }
    if (selectedValueComp.length > 0 && selectedValueComp !== null) {
      selectedValueComp.forEach((value, i) => {
        if (value[i] !== undefined && value[i].key !== 0) {
          atleastOne = 1
          if (value[i].key.charAt(0) === 'V' || value[i].key.charAt(0) === 'v') {
            cblockline = cblockline + ' I(' + String(value[i].key) + ') '
          }
        }
      })
    }
    if (controlBlockParam.length > 0) {
      cblockline = cblockline + ' ' + controlBlockParam
      atleastOne = 1
    }

    if (atleastOne === 0) cblockline = 'all'
    controlBlock = `\n.control \nrun \nprint ${cblockline} > data.txt \n.endc \n.end`
    // console.log(controlLine)

    dispatch(setControlLine(controlLine))
    dispatch(setControlBlock(controlBlock))
    // setTimeout(function () { }, 2000)

    var netlist = netfile.title + '\n\n' +
      compNetlist.models + '\n' +
      compNetlist.main + '\n' +
      controlLine + '\n' +
      controlBlock + '\n'
    dispatch(setNetlist(netlist))
    prepareNetlist(netlist)

    // handlesimulateOpen()
  }

  // simulation properties add expression input box
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleAddExpressionClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAddExpressionClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <div className={classes.SimulationOptions}>
        <SimulationScreen open={simulateOpen} isResult={isResult} close={handleSimulateClose} task_id={taskId} simType={simType} />

        {/* Simulation modes list */}
        <List>

          {/* DC Solver */}
          <ListItem className={classes.simulationOptions} divider>
            <div className={classes.propertiesBox}>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{ width: '100%  ' }}
                >
                  <Typography className={classes.heading}>DC Solver</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <form>
                    <List>
                      <ListItem>

                        <Button aria-describedby={id} variant="outlined" color="primary" size="small" onClick={handleAddExpressionClick}>
                          Add Expression
                        </Button>
                        <Tooltip title={'Add expression seperated by spaces.\n Include #branch at end of expression to indicate current  e.g v1#branch. To add multiple expression seperate them by spaces eg. v1 v2 v3#branch'}>
                          <IconButton aria-label="info">
                            <InfoOutlinedIcon style={{ fontSize: 'large' }} />
                          </IconButton>
                        </Tooltip>
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleAddExpressionClose}

                          anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'left'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                          }}
                        >

                          <TextField id="controlBlockParam" placeHolder="enter expression" size='large' variant="outlined"
                            value={controlBlockParam}
                            onChange={handleControlBlockParam}
                          />
                        </Popover>
                      </ListItem>
                      <ListItem>
                        <Button size='small' variant="contained" color="primary"
                          onClick={(e) => { startSimulate('DcSolver') }}>
                          Run dc solver
                        </Button>
                      </ListItem>
                    </List>
                  </form>
                </ExpansionPanelDetails>
              </ExpansionPanel>

            </div>
          </ListItem>

          {/* DC Sweep */}
          <ListItem className={classes.simulationOptions} divider>
            <ExpansionPanel onClick={onDcSweepTabExpand}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ width: '97%' }}
              >
                <Typography className={classes.heading}>DC Sweep</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <form className={classes.propertiesBox} noValidate autoComplete="off">
                  <List>
                    <ListItem>
                      <TextField
                        style={{ width: '100%' }}
                        id="parameter"
                        size='small'
                        variant="outlined"
                        select
                        label="Select Component"
                        value={dcSweepcontrolLine.parameter}
                        onChange={handleDcSweepControlLine}
                        SelectProps={{
                          native: true
                        }}
                      >

                        {
                          componentsList.map((value, i) => {
                            if (value.charAt(0) === 'V' || value.charAt(0) === 'v' || value.charAt(0) === 'I' || value.charAt(0) === 'i' || value === '') {
                              return (<option key={i} value={value}>
                                {value}
                              </option>)
                            } else {
                              return null
                            }
                          })
                        }

                      </TextField>

                    </ListItem>

                    <ListItem>
                      <TextField id="start" label="Start Voltage" size='small' variant="outlined"
                        value={dcSweepcontrolLine.start}
                        onChange={handleDcSweepControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>V</span>
                    </ListItem>
                    <ListItem>
                      <TextField id="stop" label="Stop Voltage" size='small' variant="outlined"
                        value={dcSweepcontrolLine.stop}
                        onChange={handleDcSweepControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>V</span>
                    </ListItem>
                    <ListItem>
                      <TextField id="step" label="Step" size='small' variant="outlined"
                        value={dcSweepcontrolLine.step}
                        onChange={handleDcSweepControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>V</span>
                    </ListItem>

                    {/* SECONDARY PARAMETER FOR SWEEP */}
                    <Divider />
                    <ListItem>

                      <h4 style={{ marginLeft: '10px' }}>Secondary Parameters</h4>
                    </ListItem>

                    <ListItem>

                      <TextField
                        style={{ width: '100%' }}
                        id="parameter2"
                        size='small'
                        variant="outlined"
                        select
                        label="Select Component"
                        value={dcSweepcontrolLine.parameter2}
                        onChange={handleDcSweepControlLine}
                        SelectProps={{
                          native: true
                        }}

                      >

                        {
                          componentsList.map((value, i) => {
                            return <option key={i} value={value}>
                              {value}
                            </option>
                          })
                        }

                      </TextField>

                    </ListItem>

                    <ListItem>
                      <TextField id="start2" label="Start Value" size='small' variant="outlined"
                        value={dcSweepcontrolLine.start2}
                        onChange={handleDcSweepControlLine}
                      />

                    </ListItem>
                    <ListItem>
                      <TextField id="stop2" label="Stop Value" size='small' variant="outlined"
                        value={dcSweepcontrolLine.stop2}
                        onChange={handleDcSweepControlLine}
                      />

                    </ListItem>
                    <ListItem>
                      <TextField id="step2" label="Step Value" size='small' variant="outlined"
                        value={dcSweepcontrolLine.step2}
                        onChange={handleDcSweepControlLine}
                      />

                    </ListItem>
                    <ListItem>
                      <Multiselect
                        style={{ width: '100%' }}
                        id="Nodes"
                        closeOnSelect="false"
                        placeholder="Select Node"
                        onSelect={handleAddSelectedValueDCSweep}
                        onRemove={handleRemSelectedValueDCSweep}
                        options={analysisNodeArray} displayValue="key"
                        avoidHighlightFirstOption = "true"
                      />
                    </ListItem>
                    <ListItem>
                      <Multiselect
                        style={{ width: '100%' }}
                        id="Branch"
                        closeOnSelect="false"
                        placeholder="Select VSRC"
                        onSelect={handleAddSelectedValueDCSweepComp}
                        onRemove={handleRemSelectedValueDCSweepComp}
                        options={analysisCompArray} displayValue="key"
                        avoidHighlightFirstOption = "true"
                      />
                    </ListItem>
                    <ListItem>

                      <Button aria-describedby={id} variant="outlined" color="primary" size="small" onClick={handleAddExpressionClick}>
                        Add Expression
                      </Button>
                      <Tooltip title={'Add expression seperated by spaces.\n Include #branch at end of expression to indicate current  e.g v1#branch. To add multiple expression seperate them by spaces eg. v1 v2 v3#branch'}>
                        <IconButton aria-label="info">
                          <InfoOutlinedIcon style={{ fontSize: 'large' }} />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleAddExpressionClose}

                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                      >

                        <TextField id="controlBlockParam" placeHolder="enter expression" size='large' variant="outlined"
                          value={controlBlockParam}
                          onChange={handleControlBlockParam}
                        />

                      </Popover>

                    </ListItem>

                    <ListItem>
                      <Button id="dcSweepSimulate" size='small' variant="contained" color="primary" onClick={(e) => { startSimulate('DcSweep') }}>
                        Simulate
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ListItem>

          {/* Transient Analysis */}
          <ListItem className={classes.simulationOptions} divider>
            <ExpansionPanel onClick={onTransientAnalysisTabExpand}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ width: '97%' }}
              >
                <Typography className={classes.heading}>Transient Analysis</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <form className={classes.propertiesBox} noValidate autoComplete="off">
                  <List>
                    <ListItem>
                      <TextField id="start" label="Start Time" size='small' variant="outlined"
                        value={transientAnalysisControlLine.start}
                        onChange={handleTransientAnalysisControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>S</span>
                    </ListItem>
                    <ListItem>
                      <TextField id="stop" label="Stop Time" size='small' variant="outlined"
                        value={transientAnalysisControlLine.stop}
                        onChange={handleTransientAnalysisControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>S</span>
                    </ListItem>
                    <ListItem>
                      <TextField id="step" label="Time Step" size='small' variant="outlined"
                        value={transientAnalysisControlLine.step}
                        onChange={handleTransientAnalysisControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>S</span>
                    </ListItem>
                    <ListItem>
                      <Checkbox id="skipInitial" label="Use Initial Conditions" size='small' variant="outlined"
                        value={transientAnalysisControlLine.skipInitial}
                        onChange={handleTransientAnalysisControlLineUIC}
                      />
                      <span style={{ marginLeft: '10px' }}>Use Initial Conditions</span>
                    </ListItem>
                    <ListItem>
                      { nodeList.forEach((value) => {
                        if (value !== null && value !== '') {
                          analysisNodeArray.push({ key: value })
                        }
                      })
                      }

                      <Multiselect
                        style={{ width: '100%' }}
                        id="Nodes"
                        closeOnSelect="false"
                        placeholder="Select Node"
                        onSelect={handleAddSelectedValueTransientAnal}
                        onRemove={handleRemSelectedValueTransientAnal}
                        options={analysisNodeArray} displayValue="key"
                        avoidHighlightFirstOption = "true"
                      />
                    </ListItem>
                    <ListItem>
                      {
                        componentsList.forEach((value) => {
                          if (value !== null && value !== '') {
                            if (value.charAt(0) === 'V' || value.charAt(0) === 'v') {
                              analysisCompArray.push({ key: value })
                            }
                          }
                        })
                      }
                      <Multiselect
                        style={{ width: '100%' }}
                        id="Branch"
                        closeOnSelect="false"
                        placeholder="Select VSRC"
                        onSelect={handleAddSelectedValueTransientAnalComp}
                        onRemove={handleRemSelectedValueTransientAnalComp}
                        options={analysisCompArray} displayValue="key"
                        avoidHighlightFirstOption = "true"
                      />
                    </ListItem>
                    <ListItem>

                      <Button aria-describedby={id} variant="outlined" color="primary" size="small" onClick={handleAddExpressionClick}>
                        Add Expression
                      </Button>
                      <Tooltip title={'Add expression seperated by spaces.\n Include #branch at end of expression to indicate current  e.g v1#branch. To add multiple expression seperate them by spaces eg. v1 v2 v3#branch'}>
                        <IconButton aria-label="info">
                          <InfoOutlinedIcon style={{ fontSize: 'large' }} />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleAddExpressionClose}

                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                      >

                        <TextField id="controlBlockParam" placeHolder="enter expression" size='large' variant="outlined"
                          value={controlBlockParam}
                          onChange={handleControlBlockParam}
                        />

                      </Popover>

                    </ListItem>
                    <ListItem>
                      <Button id="transientAnalysisSimulate" size='small' variant="contained" color="primary" onClick={(e) => { startSimulate('Transient') }}>
                        Simulate
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ListItem>

          {/* AC Analysis */}
          <ListItem className={classes.simulationOptions} divider>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ width: '100%' }}
              >
                <Typography className={classes.heading}>AC Analysis</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <form className={classes.propertiesBox} noValidate autoComplete="off">
                  <List>

                    <ListItem>
                      <TextField
                        style={{ width: '100%' }}
                        id="input"
                        size='small'
                        variant="outlined"
                        select
                        label="Type"
                        value={acAnalysisControlLine.input}
                        onChange={handleAcAnalysisControlLine}
                        SelectProps={{
                          native: true
                        }}

                      >
                        <option key="linear" value="lin">
                          Linear
                        </option>
                        <option key="decade" value="dec">
                          Decade
                        </option>
                        <option key="octave" value="oct">
                          Octave
                        </option>
                      </TextField>
                    </ListItem>

                    <ListItem>
                      <TextField id="pointsBydecade" label="Points/ Decade" size='small' variant="outlined"
                        value={acAnalysisControlLine.pointsBydecade}
                        onChange={handleAcAnalysisControlLine}
                      />
                    </ListItem>
                    <ListItem>
                      <TextField id="start" label="Start Frequency" size='small' variant="outlined"
                        value={acAnalysisControlLine.start}
                        onChange={handleAcAnalysisControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>Hz</span>
                    </ListItem>
                    <ListItem>
                      <TextField id="stop" label="Stop Frequency" size='small' variant="outlined"
                        value={acAnalysisControlLine.stop}
                        onChange={handleAcAnalysisControlLine}
                      />
                      <span style={{ marginLeft: '10px' }}>Hz</span>
                    </ListItem>

                    <ListItem>

                      <Button aria-describedby={id} variant="outlined" color="primary" size="small" onClick={handleAddExpressionClick}>
                        Add Expression
                      </Button>
                      <Tooltip title={'Add expression seperated by spaces. Include #branch at end of expression to indicate current  e.g v1#branch. To add multiple expression seperate them by spaces eg. v1 v2 v3#branch'}>
                        <IconButton aria-label="info">
                          <InfoOutlinedIcon style={{ fontSize: 'large' }} />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleAddExpressionClose}

                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                      >

                        <TextField id="controlBlockParam" placeHolder="enter expression" size='large' variant="outlined"
                          value={controlBlockParam}
                          onChange={handleControlBlockParam}
                        />

                      </Popover>

                    </ListItem>

                    <ListItem>
                      <Button size='small' variant="contained" color="primary" onClick={(e) => { startSimulate('Ac') }}>
                        Simulate
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ListItem>

          {/* Transfer Function Analysis */}
          <ListItem className={classes.simulationOptions} divider>
            <ExpansionPanel onClick={onTFTabExpand}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ width: '97%' }}
              >
                <Typography className={classes.heading}>Transfer Function Analysis</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <form className={classes.propertiesBox} noValidate autoComplete="off">
                  <List>
                    <ListItem>
                      <input
                        type="checkbox"
                        name="Between Nodes"
                        value={tfAnalysisControlLine.outputNodes}
                        onChange={handleTfAnalysisControlLineNodes}
                        id="outputNodes"
                        // checked={tfAnalysisControlLine.outputNodes}
                      />
                      <span style={{ marginLeft: '10px' }}>Output By Nodes</span>

                    </ListItem>
                    { nodeList.forEach((value) => {
                      if (value !== null && value !== '') {
                        nodeArray.push({ key: value })
                      }
                    })
                    }
                    { pushZero(nodeArray)}
                    <ListItem>
                      <Multiselect
                        style={{ width: '100%' }}
                        id="Nodes"
                        closeOnSelect="false"
                        placeholder="Voltage between Nodes"
                        onSelect={handleAddSelectedValueTFAnal}
                        onRemove={handleRemSelectedValueTFAnal}
                        selectionLimit="2"
                        options={nodeArray} displayValue="key"
                        disable={disabled}
                        avoidHighlightFirstOption = "true"
                      />
                    </ListItem>
                    <ListItem>
                      <TextField
                        style={{ width: '100%' }}
                        id="outputVoltageSource"
                        size='small'
                        variant="outlined"
                        select
                        label="Output Voltage SRC"
                        value={tfAnalysisControlLine.outputVoltageSource}
                        onChange={handleTfAnalysisControlLine}
                        SelectProps={{
                          native: true
                        }}
                        disabled={!disabled}
                      >

                        {
                          componentsList.map((value, i) => {
                            if (value.charAt(0) === 'V' || value.charAt(0) === 'v' || value.charAt(0) === 'I' || value.charAt(0) === 'i' || value === '') {
                              return (<option key={i} value={value}>
                                {value}
                              </option>)
                            } else {
                              return null
                            }
                          })
                        }

                      </TextField>

                    </ListItem>
                    <ListItem>
                      <TextField
                        style={{ width: '100%' }}
                        id="inputVoltageSource"
                        size='small'
                        variant="outlined"
                        select
                        label="Input Voltage SRC"
                        value={tfAnalysisControlLine.inputVoltageSource}
                        onChange={handleTfAnalysisControlLine}
                        SelectProps={{
                          native: true
                        }}
                      >

                        {
                          componentsList.map((value, i) => {
                            if (value.charAt(0) === 'V' || value.charAt(0) === 'v' || value.charAt(0) === 'I' || value.charAt(0) === 'i' || value === '') {
                              return (<option key={i} value={value}>
                                {value}
                              </option>)
                            } else {
                              return null
                            }
                          })
                        }

                      </TextField>

                    </ListItem>
                    <ListItem>

                      <Button aria-describedby={id} variant="outlined" color="primary" size="small" onClick={handleAddExpressionClick}>
                        Add Expression
                      </Button>
                      <Tooltip title={'Add expression seperated by spaces.\n Include #branch at end of expression to indicate current  e.g v1#branch. To add multiple expression seperate them by spaces eg. v1 v2 v3#branch'}>
                        <IconButton aria-label="info">
                          <InfoOutlinedIcon style={{ fontSize: 'large' }} />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleAddExpressionClose}

                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                      >

                        <TextField id="controlBlockParam" placeHolder="enter expression" size='large' variant="outlined"
                          value={controlBlockParam}
                          onChange={handleControlBlockParam}
                        />

                      </Popover>

                    </ListItem>

                    <ListItem>
                      <Button id="tfAnalysisSimulate" size='small' variant="contained" color="primary" onClick={(e) => { startSimulate('tfAnalysis') }}>
                        Simulate
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ListItem>

          <ListItem style={isSimRes ? {} : { display: 'none' }} onClick={handlesimulateOpen} >
            <Button size='small' variant="contained" color="primary" style={{ margin: '10px auto' }} onClick={handlesimulateOpen}>
              Simulation Result
            </Button>
          </ListItem>
        </List>
      </div>
    </>
  )
}
