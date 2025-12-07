async function getData() {
  const url = 'https://fakestoreapi.com/products'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const result = await response.json()
    console.log(result)
    return result
  } catch (error) {
    console.error(error.message)
    return []
  }
}

let cart = []

// getData()
const createCard = (product) => {
  return `
    <div class="flex items-center justify-center flex-col h-fit mx-auto w-65 rounded-xl hover:shadow-lg shadow-black/50 hover:scale-103 transition-all duration-300 ease-in-out bg-neutral-700 flex-wrap shadow-lg">
      <div class="w-65 flex-wrap">
        <img
          class="rounded-t-xl peer py-6 px-3 h-60 w-full object-contain flex items-center bg-neutral-900 justify-center overflow-hidden"
          src="${product.image}"
          alt="${product.title}"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        />
        <div class="p-3 flex flex-col gap-3 peer w-65">
          <div class="flex justify-between gap-3">
            <h1 class="flex flex-wrap font-semibold h-17 overflow-hidden">
              ${product.title}
            </h1>
            <p class="font-bold text-green-600 text-xl">$${product.price}</p>
          </div>
          <div class="flex justify-end items-center gap-2">
            <p class="px-2 text-sm bg-white/20 rounded-xl w-fit">
              ${product.category}
            </p>
            <div class="px-1 text-sm bg-white/20 rounded-xl w-fit flex items-center justify-center pr-2">
            <img class='w-5 h-5' src="https://cdn-icons-png.flaticon.com/512/8212/8212616.png" alt="star icon"/>
              <span>${product.rating.rate} </span> 
            </div>
          </div>
        </div>
        <button
        data-product="${JSON.stringify(product).replace(/"/g, '&quot;')}"
          class="add-to-cart p-2 font-bold hover:font-extrabold hover:bg-neutral-600 w-full items-center justify-center flex bg-neutral-800 rounded-b-xl cursor-pointer active:bg-neutral-800 opacity-100 max-h-20 xl:opacity-0 xl:max-h-0 overflow-hidden xl:peer-hover:opacity-100 xl:peer-hover:max-h-20 transition-all duration-300 delay-300 hover:opacity-100 hover:max-h-20"
        >
          Add to cart
        </button>
      </div>
    </div>
  `
}

const cartCard = (product, index) => {
  return `
    <div class="relative flex items-center justify-center flex-col h-fit mx-auto w-65 rounded-xl hover:shadow-lg shadow-black/50 hover:scale-103 transition-all duration-300 ease-in-out bg-neutral-700 flex-wrap shadow-lg">
      <div class="w-65 flex-wrap">
        <img
          class="rounded-t-xl peer py-6 px-3 h-60 w-full object-contain flex items-center bg-neutral-900 justify-center overflow-hidden"
          src="${product.image}"
          alt="${product.title}"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        />
        <div class="p-3 flex flex-col gap-3 peer w-65">
          <div class="flex justify-between gap-3">
            <h1 class="flex flex-wrap font-semibold h-17 overflow-hidden">
              ${product.title}
            </h1>
            <p class="font-bold text-green-600 text-xl">$${product.price}</p>
          </div>
          <div class="flex justify-end items-center gap-2">
            <p class="px-2 text-sm bg-white/20 rounded-xl w-fit">
              ${product.category}
            </p>
            <div class="px-1 text-sm bg-white/20 rounded-xl w-fit flex items-center justify-center pr-2">
            <img class='w-5 h-5' src="https://cdn-icons-png.flaticon.com/512/8212/8212616.png" alt="star icon"/>
              <span>${product.rating.rate} </span> 
            </div>
          </div>
        </div>
        <button
              class="remove-from-cart absolute rounded-full -top-2 -right-2 py-2 px-2.5 bg-red-200 hover:bg-red-700 font-semibold cursor-pointer text-lg font-semibold"
              data-index="${index}"
            >
              🗑️
            </button>
      </div>
    </div>
  `
}

const updateCart = () => {
  const cartContainer = document.getElementById('cards-container-carts')

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<p class="text-center col-span-full text-white">Your cart is empty</p>'
  } else {
    cartContainer.innerHTML = cart
      .map((product, index) => cartCard(product, index))
      .join('')

    // Setup remove buttons
    removeCart()
  }
}

const removeCart = () => {
  const removeButtons = document.querySelectorAll('.remove-from-cart')

  removeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'))
      cart.splice(index, 1)
      updateCart()
      console.log('Cart updated:', cart)
    })
  })
}

async function loadData() {
  const electric = document.getElementById('cards-container-electronics')
  const women = document.getElementById('cards-container-womens')

  electric.innerHTML =
    '<p class="text-center col-span-full text-white">Loading...</p>'
  women.innerHTML =
    '<p class="text-center col-span-full text-white">Loading...</p>'

  const data = await getData()

  if (data && data.length > 0) {
    const filteredElectric = data.filter(
      product => product.category === 'electronics'
    )
    const filteredWomen = data.filter(
      product => product.category === 'jewelery'
    )

    electric.innerHTML = filteredElectric
      .map(product => createCard(product))
      .join('')
    women.innerHTML = filteredWomen.map(product => createCard(product)).join('')

    addToCart()
  } else {
    electric.innerHTML =
      '<p class="text-center col-span-full text-white">No products found</p>'
    women.innerHTML =
      '<p class="text-center col-span-full text-white">No products found</p>'
  }
  updateCart()
}

const addToCart = () => {
  const buttons = document.querySelectorAll('.add-to-cart')

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const productData = this.getAttribute('data-product')
      const product = JSON.parse(productData)

      // Push product to cart
      cart.push(product)

      console.log('Product added to cart:', product)
      console.log('Current cart:', cart)

      // Update cart display
      updateCart()

      // Visual feedback
      this.textContent = 'Added!'
      setTimeout(() => {
        this.textContent = 'Add to cart'
      }, 1000)
    })
  })
}

loadData()
