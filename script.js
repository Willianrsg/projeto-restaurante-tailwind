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

let cart = []

cartBtn.addEventListener('click', () => {
  updateCartModal()
  cartModal.style.display = 'flex'
})

closeModal.addEventListener('click', () => {
  cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => { 
  let parentBtn  = event.target.closest('.add-to-cart-btn')
  if(parentBtn){
    const name = parentBtn.getAttribute('data-name')
    const price = parseFloat(parentBtn.getAttribute('data-price'))
    addToCart(name, price)
  }
})

function addToCart(name, price){
  const existingItems = cart.find(item => item.name === name)
  if(existingItems){
    existingItems.quantity +=1
    return
  } else {
    cart.push({name, price, quantity: 1})
  }
  updateCartModal()
}

function updateCartModal(){
  cartItemsContainer.innerHTML = ""
  let total = 0
  cart.forEach(item => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="font-medium">
          <p>${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mte-2">Valor: ${item.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</p>
        </div>
        <button class="remove-cart" data-name="${item.name}">Remover</button>
      </div>
    `
    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItemElement)
  })
  cartTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  cartCount.innerHTML = cart.length
}

cartItemsContainer.addEventListener('click', (event) => {
  if(event.target.classList.contains('remove-cart')) {
    const name = event.target.getAttribute('data-name')
    removeItemCart(name)
  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name)
  if(index !== -1){
    const item = cart[index]
    if(item.quantity > 1) {
      item.quantity -= 1
      updateCartModal()
      return
    } 
    cart.splice(index, 1)
    updateCartModal()
  }
}

addressInput.addEventListener('input', (event) => {
  let inputValue = event.target.value
  if(inputValue !== ''){
    addressInput.classList.remove('border-red-500')
    addressWarn.classList.add('hidden')
  }
})

checkoutBtn.addEventListener('click', () => {
  const isOpen = checkRestaurantOpen()
  if(!isOpen){
    // alert('Estamos Fechados no momento!')
    // Toastify({
    //   text: 'Ops! Estamos Fechados no momento!',
    //   duration: 3000,
    //   close: true,
    //   gravity: 'top',
    //   position: 'right',
    //   stopOnFocus: true,
    //   style: {
    //     background: '#ef4444',
    //   }
    // }).showToast()
    Toastify({
      text: "Ops! Estamos Fechados no momento!",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
      // onClick: function(){} // Callback after click
    }).showToast();
    return
  }
  if(cart.length === 0) return
  if(addressInput.value === '') {
    addressWarn.classList.remove('hidden')
    addressInput.classList.add('border-red-500')
    return
  }

  const cartItems = cart.map(item => {
    return (
      `${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} | <br/>`
    )
  }).join('')

  const message = encodeURIComponent(cartItems)
  const phone = '44988113232'
  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blank')
  cart = []
  updateCartModal()
})

function checkRestaurantOpen() {
  const data =  new Date()
  const hora = data.getHours()
  return hora >= 18 && hora <= 22
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