const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModal = document.getElementById('close-modal-btn')
const cartCount = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')
const categoryBtns = document.querySelectorAll('.category-btn')
const sections = document.querySelectorAll('main > section[data-section]')
const summaryBar = document.getElementById('cart-summary-bar')
const summaryText = document.getElementById('summary-text')
const summaryCartBtn = document.getElementById('summary-cart-btn')
const paymentBtns = document.querySelectorAll('.payment-btn')
const paymentWarn = document.getElementById('payment-warn')
const changeWrapper = document.getElementById('change-wrapper')
const changeValueInput = document.getElementById('change-value')

let cart = []
let selectedPayment = null

function openCartModal() {
  updateCartModal()
  cartModal.classList.remove('hidden')
  cartModal.classList.add('flex')
}

function closeCartModal() {
  cartModal.classList.remove('flex')
  cartModal.classList.add('hidden')
}

cartBtn.addEventListener('click', () => {
  openCartModal()
})

summaryCartBtn.addEventListener('click', () => {
  openCartModal()
})

closeModal.addEventListener('click', () => {
  closeCartModal()
})

cartModal.addEventListener('click', (event) => {
  if (event.target === cartModal) {
    closeCartModal()
  }
})

// FILTRO DE CATEGORIAS
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const category = btn.getAttribute('data-category')

    if (category === 'all') {
      sections.forEach(section => section.classList.remove('hidden'))
    } else {
      sections.forEach(section => {
        if (section.getAttribute('data-section') === category) {
          section.classList.remove('hidden')
        } else {
          section.classList.add('hidden')
        }
      })
    }
  })
})

// CONTADOR DE QUANTIDADE NO CARD (antes de adicionar ao carrinho)
menu.addEventListener('click', (event) => {
  const increaseBtn = event.target.closest('.qty-increase')
  const decreaseBtn = event.target.closest('.qty-decrease')
  const addBtn = event.target.closest('.add-to-cart-btn')

  if (increaseBtn) {
    const card = increaseBtn.closest('.product-card')
    const qtyEl = card.querySelector('.qty-value')
    qtyEl.textContent = parseInt(qtyEl.textContent) + 1
  }

  if (decreaseBtn) {
    const card = decreaseBtn.closest('.product-card')
    const qtyEl = card.querySelector('.qty-value')
    const current = parseInt(qtyEl.textContent)
    if (current > 1) {
      qtyEl.textContent = current - 1
    }
  }

  if (addBtn) {
    const card = addBtn.closest('.product-card')
    const qtyEl = card.querySelector('.qty-value')
    const quantity = parseInt(qtyEl.textContent)
    const name = addBtn.getAttribute('data-name')
    const price = parseFloat(addBtn.getAttribute('data-price'))

    addToCart(name, price, quantity)
    showAddedToast(name, quantity)
    pulseButton(addBtn)

    qtyEl.textContent = 1
  }
})

function pulseButton(btn) {
  btn.classList.add('animate-pop')
  setTimeout(() => btn.classList.remove('animate-pop'), 300)
}

function showAddedToast(name, quantity) {
  Toastify({
    text: `${quantity}x ${name} adicionado ao carrinho!`,
    duration: 2000,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: '#ea580c',
    },
  }).showToast()
}

function addToCart(name, price, quantity) {
  const existingItems = cart.find(item => item.name === name)
  if (existingItems) {
    existingItems.quantity += quantity
  } else {
    cart.push({ name, price, quantity })
  }
  updateCartModal()
}

function updateCartModal() {
  cartItemsContainer.innerHTML = ""

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-8 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p class="text-sm">Seu carrinho está vazio</p>
      </div>
    `
    cartTotal.textContent = (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    cartCount.innerHTML = 0
    summaryBar.classList.add('hidden')
    return
  }

  let total = 0
  cart.forEach(item => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'items-center', 'justify-between', 'gap-3', 'py-3', 'border-b', 'border-gray-100', 'last:border-b-0')
    cartItemElement.innerHTML = `
      <div class="flex-1">
        <p class="font-medium text-gray-900">${item.name}</p>
        <p class="text-sm text-gray-500">${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} un.</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="decrease-qty w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors duration-150" data-name="${item.name}">−</button>
        <span class="w-6 text-center font-medium">${item.quantity}</span>
        <button class="increase-qty w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors duration-150" data-name="${item.name}">+</button>
      </div>

      <button class="remove-cart w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors duration-150" data-name="${item.name}" title="Remover item">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
        </svg>
      </button>
    `
    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItemElement)
  })

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  cartTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  cartCount.innerHTML = totalItems

  summaryText.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} · ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
  summaryBar.classList.remove('hidden')
}

cartItemsContainer.addEventListener('click', (event) => {
  const increaseBtn = event.target.closest('.increase-qty')
  const decreaseBtn = event.target.closest('.decrease-qty')
  const removeBtn = event.target.closest('.remove-cart')

  if (increaseBtn) {
    changeQuantity(increaseBtn.getAttribute('data-name'), 1)
  }
  if (decreaseBtn) {
    changeQuantity(decreaseBtn.getAttribute('data-name'), -1)
  }
  if (removeBtn) {
    removeItemCart(removeBtn.getAttribute('data-name'))
  }
})

function changeQuantity(name, delta) {
  const item = cart.find(item => item.name === name)
  if (!item) return

  item.quantity += delta

  if (item.quantity <= 0) {
    removeItemCart(name)
    return
  }
  updateCartModal()
}

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)
  if (index !== -1) {
    cart.splice(index, 1)
    updateCartModal()
  }
}

addressInput.addEventListener('input', (event) => {
  let inputValue = event.target.value
  if (inputValue !== '') {
    addressInput.classList.remove('border-red-500')
    addressWarn.classList.add('hidden')
  }
})

paymentBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    paymentBtns.forEach(b => b.classList.remove('selected'))
    btn.classList.add('selected')
    selectedPayment = btn.getAttribute('data-payment')
    paymentWarn.classList.add('hidden')

    if (selectedPayment === 'Dinheiro') {
      changeWrapper.classList.remove('hidden')
    } else {
      changeWrapper.classList.add('hidden')
      changeValueInput.value = ''
    }
  })
})

// MÁSCARA MONETÁRIA NO CAMPO DE TROCO
changeValueInput.addEventListener('input', (event) => {
  let value = event.target.value

  // Mantém apenas números
  value = value.replace(/\D/g, '')

  if (value === '') {
    event.target.value = ''
    return
  }

  // Converte para número e divide por 100 para posicionar os centavos
  value = (parseInt(value, 10) / 100).toFixed(2)

  // Formata como moeda brasileira (R$ 1.234,56)
  event.target.value = parseFloat(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

checkoutBtn.addEventListener('click', () => {
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops! Estamos Fechados no momento!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast()
    return
  }
  if (cart.length === 0) return
  if (addressInput.value === '') {
    addressWarn.classList.remove('hidden')
    addressInput.classList.add('border-red-500')
    return
  }
  if (!selectedPayment) {
    paymentWarn.classList.remove('hidden')
    return
  }

  const cartItems = cart.map(item => {
    return (
      `${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} | <br/>`
    )
  }).join('')

  let paymentInfo = `Forma de pagamento: ${selectedPayment}`
  if (selectedPayment === 'Dinheiro' && changeValueInput.value !== '') {
    paymentInfo += ` (troco para R$ ${changeValueInput.value})`
  }

  const message = encodeURIComponent(`${cartItems} ${paymentInfo}`)
  const phone = '44988113232'
  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blank')

  cart = []
  selectedPayment = null
  paymentBtns.forEach(b => b.classList.remove('selected'))
  changeWrapper.classList.add('hidden')
  changeValueInput.value = ''
  updateCartModal()
  closeCartModal()
})

function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 14 && hora <= 22
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-600')
} else {
  spanItem.classList.remove('bg-green-600')
  spanItem.classList.add('bg-red-500')
}