/* eslint-disable react/prop-types */
import React from 'react'
import { IconButton, Menu, MenuItem, Fade, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  tools: {
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
    color: '#262626'
  }
})

function buildFileSelector () {
  const fileSelector = document.createElement('input')
  fileSelector.setAttribute('type', 'file')
  fileSelector.setAttribute('multiple', 'multiple')
  return fileSelector
}

class MenuButton extends React.Component {
  // eslint-disable-next-line
  state = {
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };

  componentDidMount () {
    this.fileSelector = buildFileSelector()
  }

  handleFileSelect = (e) => {
    e.preventDefault()
    this.fileSelector.click()
  }

  render () {
    const { classes } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const Wrapper = this.props.iconType
    const listItems = this.props.items.map((link) =>
      <MenuItem onClick={this.handleFileSelect} key={link}>{link}</MenuItem>
    )
    // console.log(listItems.id)
    return (
      <>
        <Tooltip title={this.props.title} >
          <IconButton
            aria-owns={open ? 'menu-toolbar' : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
            className={classes.tools}
            size="small"
          >
            {<Wrapper fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-toolbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={open}
          style={{ marginTop: '48px' }}
          TransitionComponent={Fade}
          onClose={this.handleClose}
        >
          {listItems}
        </Menu>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(MenuButton)
