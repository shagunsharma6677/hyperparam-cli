import { stringify } from 'hightable'
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { parquetDataFrame } from '../tableProvider.js'
import Layout from './Layout.js'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript'

enum LoadingState {
  NotLoaded,
  Loading,
  Loaded
}

const editorOptions = {
  colorDecorators: true,
  contextmenu: false,
  selectOnLineNumbers: true,
  readOnly: true,
  language: 'javascript',
  automaticLayout: true,
}

/**
 * Cell viewer displays a single cell from a table.
 */
export default function CellView() {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NotLoaded)
  const [text, setText] = useState<string | undefined>()
  const [error, setError] = useState<Error>()

  // File path from url
  const search = new URLSearchParams(location.search)
  const key = decodeURIComponent(search.get('key') || '').replace(/\/$/, '')
  const path = key.split('/')
  const isUrl = key.startsWith('http://') || key.startsWith('https://')
  const url = isUrl ? key : '/api/store/get?key=' + key

  // row, col from url
  const row = Number(search.get('row'))
  const col = Number(search.get('col'))

  // Load cell data
  useEffect(() => {
    async function loadCellData() {
      try {
        // TODO: handle first row > 100kb
        const df = await parquetDataFrame(url)
        const rows = await df.rows(row, row + 1)
        const cell = rows[0][col]
        setText(stringify(cell))
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(LoadingState.Loaded)
      }
    }

    setLoading(loading => {
      // use loading state to ensure we only load content once
      if (loading !== LoadingState.NotLoaded) return loading
      loadCellData()
      return LoadingState.Loading
    })
  }, [col, row, loading, setError])

  return <Layout error={error} title={key}>
    <nav className='top-header'>
      <div className='path'>
        {isUrl &&
          <a href={`/files?key=${key}`}>{key}</a>
        }
        {!isUrl && <>
          <a href='/files'>/</a>
          {key && key.split('/').slice(0, -1).map((sub, depth) =>
            <a href={`/files?key=${path.slice(0, depth + 1).join('/')}/`} key={depth}>{sub}/</a>
          )}
          <a href={`/files?key=${key}`}>{path.at(-1)}</a>
        </>}
      </div>
    </nav>

    {/* @ts-expect-error MonocoEditor type is wrong? */
      <MonacoEditor
        className='code'
        height="100vh"
        options={editorOptions}
        theme='vs-dark'
        value={text}
        width="100%" />
    }
  </Layout>
}
