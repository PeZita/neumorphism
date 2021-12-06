import React, { useEffect, useState, useRef } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import ShapeSwitcher from './ShapeSwitcher'
import { isValidColor, colorLuminance, getContrast, getColorFromRoute, getSizes } from './utils'
import { prism as Light, atomDark as Dark } from 'react-syntax-highlighter/dist/esm/styles/prism/'
import ConfigurationRow from './ConfigurationRow'

SyntaxHighlighter.registerLanguage('css', css)

const Configuration = ({ previewBox, activeLightSource = 1 }) => {
  const [blur, setBlur] = useState(60)
  const [color, setColor] = useState(getColorFromRoute() || '#e0e0e0')
  const [backgroundColor, setBackgroundColor] = useState(getColorFromRoute() || '#2e2e2e')
  const [size, setSize] = useState(300)
  const [radius, setRadius] = useState(50)
  const [shape, setShape] = useState(0)
  const [distance, setDistance] = useState(20)
  const [colorDifference, setColorDifference] = useState(0.15)
  const [maxSize, setMaxSize] = useState(410)
  const [maxRadius, setMaxRadius] = useState(150)
  const [gradient, setGradient] = useState(false)
  const [codeString, setCodeString] = useState('')
  const codeContainer = useRef()
  const code = useRef()
  const colorInput = useRef()
  const backgroundColorInput = useRef()

  const theme = useRef(false)

  const colorOnChange = ({ target: { value } }) => {
    if (isValidColor(value)) {
      setColor(value)
    }
  }

  const backgroundColorOnChange = ({ target: { value } }) => {
    if (isValidColor(value)) {
      setBackgroundColor(value)
    }
  }

  const handleColor = e => {
    window.history.replaceState('homepage', 'Title', '/' + e.target.value)
    setColor(e.target.value)
  }

  const handleBackground = e => {
    window.history.replaceState('homepage', 'Title', '/' + e.target.value)
    setBackgroundColor(e.target.value)
  }

  const copyToClipboard = e => {
    const el = codeContainer.current
    el.select()
    el.setSelectionRange(0, 99999)
    document.execCommand('copy')
    code.current.classList.add('copied')

    setTimeout(() => {
      code.current.classList.remove('copied')
    }, 1000)
  }

  const handleDistance = ({ target: { value } }) => {
    setDistance(value)
    setBlur(value * 2)
  }

  const handleSize = ({ target: { value } }) => {
    setSize(value)
    setDistance(Math.round(value * 0.1))
    setBlur(Math.round(value * 0.2))
    setMaxRadius(Math.round(value / 2))
  }

  const handleShape = ({
    target: {
      dataset: { shape }
    }
  }) => {
    const shapeId = parseInt(shape)
    setShape(shapeId)
    if (shapeId === 2 || shapeId === 3) {
      setGradient(true)
    } else {
      setGradient(false)
    }
  }

  useEffect(() => {
    window.history.replaceState('homepage', 'Title', '/' + color)
    const { maxSize, size } = getSizes()
    setMaxSize(maxSize)
    setSize(size)
  }, [])

  useEffect(() => {
    if (!isValidColor(color)) {
      return
    }
    let angle, positionX, positionY
    const darkShadow = colorLuminance(backgroundColor, colorDifference * -1)
    const darkShadow1 = colorLuminance(backgroundColor, colorDifference * -0.9)
    const darkShadow2 = colorLuminance(backgroundColor, colorDifference * -0.8)
    const darkShadow3 = colorLuminance(backgroundColor, colorDifference * -0.7)
    const darkShadow4 = colorLuminance(backgroundColor, colorDifference * -0.6)
    const mediumShadow = colorLuminance(backgroundColor, colorDifference * -0.5)
    const lightShadow4 = colorLuminance(backgroundColor, colorDifference * -0.4)
    const lightShadow3 = colorLuminance(backgroundColor, colorDifference * -0.3)
    const lightShadow2 = colorLuminance(backgroundColor, colorDifference * -0.2)
    const lightShadow1 = colorLuminance(backgroundColor, colorDifference * -1)
    const lightShadow = colorLuminance(backgroundColor, colorDifference)

    const firstGradientColor =
      gradient && shape !== 1 ? colorLuminance(color, shape === 3 ? 0.07 : -0.1) : color
    const secondGradientColor =
      gradient && shape !== 1 ? colorLuminance(color, shape === 2 ? 0.07 : -0.1) : color

    // TODO: replace with a map
    switch (activeLightSource) {
      case 1:
        positionX = distance
        positionY = distance
        angle = 145
        break
      case 2:
        positionX = distance * -1
        positionY = distance
        angle = 225
        break
      case 3:
        positionX = distance * -1
        positionY = distance * -1
        angle = 315
        break
      case 4:
        positionX = distance
        positionY = distance * -1
        angle = 45
        break
      default:
        positionX = distance
        positionY = distance
        angle = 145
        break
    }

    colorInput.current.value = color
    backgroundColorInput.current.value = backgroundColor

    document.documentElement.style.cssText = `
      --positionX: ${positionX}px;
      --positionXOpposite: ${positionX * -1}px;
      --positionY: ${positionY}px;
      --positionYOpposite: ${positionY * -1}px;
      --angle: ${angle}deg;
      --blur: ${blur}px;
      --textColor: ${getContrast(color)};
      --textColorOpposite: ${color};
      --baseColor: ${color};
      --backgroundColor: ${backgroundColor};
      --darkShadow: ${darkShadow};
      --darkShadow1: ${darkShadow1};
      --darkShadow2: ${darkShadow2};
      --darkShadow3: ${darkShadow3};
      --darkShadow4: ${darkShadow4};
      --mediumShadow: ${mediumShadow};
      --lightShadow1: ${lightShadow1};
      --lightShadow2: ${lightShadow2};
      --lightShadow3: ${lightShadow3};
      --lightShadow4: ${lightShadow4};
      --lightShadow: ${lightShadow};
      --firstGradientColor: ${firstGradientColor};
      --secondGradientColor: ${secondGradientColor};
      --size: ${size}px;
      --radius: ${radius}px;
    `
    if (shape === 1) {
      previewBox.current.classList.add('pressed')
    } else {
      previewBox.current.classList.remove('pressed')
    }

    if (isValidColor(color)) {
      if (getContrast(color) === '#001f3f') {
        theme.current = true
      } else {
        theme.current = false
      }
    }

    const borderRadius = parseInt(radius) === maxRadius ? '50%' : radius + 'px'
    const background =
      gradient && shape !== 1
        ? `linear-gradient(${angle}deg, ${firstGradientColor}, ${secondGradientColor})`
        : `${color}`
    const boxShadowPosition = shape === 1 ? 'inset' : ''
    const darkBoxShadow = `${boxShadowPosition} ${positionX}px ${positionY}px ${blur}px ${darkShadow}`
    const darkBoxShadow1 = `${boxShadowPosition} ${positionX * 0.8}px ${
      positionY * 0.8
    }px ${blur}px ${darkShadow1}`
    const darkBoxShadow2 = `${boxShadowPosition} ${positionX * 0.6}px ${
      positionY * 0.6
    }px ${blur}px ${darkShadow2}`
    const darkBoxShadow3 = `${boxShadowPosition} ${positionX * 0.4}px ${
      positionY * 0.4
    }px ${blur}px ${darkShadow3}`
    const darkBoxShadow4 = `${boxShadowPosition} ${positionX * 0.2}px ${
      positionY * 0.2
    }px ${blur}px ${darkShadow4}`
    const mediumBoxShadow = `${boxShadowPosition} ${positionX * 0}px ${
      positionY * 0
    }px ${blur}px ${mediumShadow}`
    const lightBoxShadow4 = `${boxShadowPosition} ${positionX * -0.2}px ${
      positionY * -0.2
    }px ${blur}px ${lightShadow4}`
    const lightBoxShadow3 = `${boxShadowPosition} ${positionX * -0.4}px ${
      positionY * -0.4
    }px ${blur}px ${lightShadow3}`
    const lightBoxShadow2 = `${boxShadowPosition} ${positionX * -0.6}px ${
      positionY * -0.6
    }px ${blur}px ${lightShadow2}`
    const lightBoxShadow1 = `${boxShadowPosition} ${positionX * -0.8}px ${
      positionY * -0.8
    }px ${blur}px ${lightShadow4}`
    const lightBoxShadow = `${boxShadowPosition} ${positionX * -1}px ${
      positionY * -1
    }px ${blur}px ${lightShadow}`

    setCodeString(
      `border-radius: ${borderRadius};
background: ${background};
box-shadow: ${darkBoxShadow},
            ${darkBoxShadow1},
            ${darkBoxShadow2},
            ${darkBoxShadow3},
            ${darkBoxShadow4},
            ${mediumBoxShadow},
            ${lightBoxShadow4},
            ${lightBoxShadow3},
            ${lightBoxShadow2},
            ${lightBoxShadow1},
            ${lightBoxShadow};`
    )
    document.documentElement.style.cssText =
      document.documentElement.style.cssText +
      `--box-shadow: ${darkBoxShadow},
                    ${darkBoxShadow1},
                    ${darkBoxShadow2},
                    ${darkBoxShadow3},
                    ${darkBoxShadow4},
                    ${mediumBoxShadow},
                    ${lightBoxShadow4},
                    ${lightBoxShadow3},
                    ${lightBoxShadow2},
                    ${lightBoxShadow1},
                    ${lightBoxShadow};`
  })
  return (
    <div className="configuration soft-shadow">
      <div className="row">
        <label htmlFor="color">Pick a color:</label>
        <input
          type="color"
          name="color"
          onChange={handleColor}
          placeholder="#ffffff"
          value={color}
          id="color"
        />
        <label htmlFor="colorInput" style={{ paddingLeft: '10px' }}>
          or
        </label>
        <input
          type="text"
          placeholder="#ffffff"
          name="color"
          id="colorInput"
          ref={colorInput}
          onChange={colorOnChange}
        />
      </div>
      <div className="row">
        <label htmlFor="color">Pick background:</label>
        <input
          type="color"
          name="color"
          onChange={handleBackground}
          placeholder="#2e2e2e"
          value={backgroundColor}
          id="backgroundColor"
        />
        <label htmlFor="backgroundColorInput" style={{ paddingLeft: '10px' }}>
          or
        </label>
        <input
          type="text"
          placeholder="#2e2e2e"
          name="color"
          id="backgroundColorInput"
          ref={backgroundColorInput}
          onChange={backgroundColorOnChange}
        />
      </div>
      <ConfigurationRow
        label={'Size'}
        type={'range'}
        value={size}
        onChange={handleSize}
        min={'10'}
        max={maxSize}
      />
      <ConfigurationRow
        label={'Radius'}
        type={'range'}
        value={radius}
        onChange={e => setRadius(e.target.value)}
        min={'0'}
        max={maxRadius}
      />
      <ConfigurationRow
        label={'Distance'}
        type={'range'}
        value={distance}
        onChange={handleDistance}
        min={'5'}
        max={'50'}
      />
      <ConfigurationRow
        label={'Intensity'}
        type={'range'}
        value={colorDifference}
        onChange={e => setColorDifference(e.target.value)}
        min={'0.01'}
        max={'0.6'}
        step={'0.01'}
      />
      <ConfigurationRow
        label={'Blur'}
        type={'range'}
        value={blur}
        onChange={e => setBlur(e.target.value)}
        min={'0'}
        max={'100'}
      />
      <ShapeSwitcher shape={shape} setShape={handleShape} />
      <div className={`code-block ${theme.current ? '' : 'small'}`} ref={code}>
        <button className="copy" onclick={copyToClipboard}>
          Copy
        </button>
        <SyntaxHighlighter language="css" style={theme.current ? Dark : Light}>
          {codeString}
        </SyntaxHighlighter>
        <label htmlFor="code-container" className="hidden">
          hidden
        </label>
        <textarea id="code-container" ref={codeContainer} value={codeString} readOnly></textarea>
      </div>
      <a
        href="https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6"
        className="link"
        target="_blank"
        rel="noopener"
        onclick="getOutboundLink('https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6'); return true;"
      >
        Read more about <b>Neumorphism</b>
      </a>
    </div>
  )
}

export default Configuration
