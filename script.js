const title = document.getElementById('title')

async function getData() {
  const url = 'https://api.escuelajs.co/api/v1/products'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const result = await response.json()
    return result
    // console.log(result)
  } catch (error) {
    console.error(error.message)
  }
}

const data = getData()


const loadData = async () => {
  title.innerHTML(data.title)
}