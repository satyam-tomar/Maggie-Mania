let cart = [];

function openOrderModal() {
  const isLoggedIn = document.querySelector('.user-name');
  if (!isLoggedIn) {
    alert('Please login to place an order');
    window.location.href = '/auth/login';
    return;
  }
  document.getElementById('orderModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
  const orderModal = document.getElementById('orderModal');
  const checkoutModal = document.getElementById('checkoutModal');
  if (event.target === orderModal) {
    closeOrderModal();
  }
  if (event.target === checkoutModal) {
    closeCheckoutModal();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    const minusBtn = item.querySelector('.minus');
    const plusBtn = item.querySelector('.plus');
    const qtyInput = item.querySelector('.qty-input');
    const masalaCheckbox = item.querySelector('.masala-extra');
    
    const itemName = item.dataset.name;
    const itemPrice = parseFloat(item.dataset.price);
    
    plusBtn.addEventListener('click', () => {
      let currentQty = parseInt(qtyInput.value);
      if (currentQty < 50) {
        currentQty++;
        qtyInput.value = currentQty;
        updateCart(itemName, itemPrice, currentQty, masalaCheckbox);
      }
    });
    
    minusBtn.addEventListener('click', () => {
      let currentQty = parseInt(qtyInput.value);
      if (currentQty > 0) {
        currentQty--;
        qtyInput.value = currentQty;
        updateCart(itemName, itemPrice, currentQty, masalaCheckbox);
      }
    });
    
    masalaCheckbox.addEventListener('change', () => {
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 0) {
        updateCart(itemName, itemPrice, currentQty, masalaCheckbox);
      }
    });
  });
});

function updateCart(itemName, itemPrice, quantity, masalaCheckbox) {
  const existingItemIndex = cart.findIndex(item => item.name === itemName);
  
  if (quantity === 0) {
    if (existingItemIndex !== -1) {
      cart.splice(existingItemIndex, 1);
    }
  } else {
    const hasExtraMasala = masalaCheckbox.checked;
    const packets = parseInt(masalaCheckbox.dataset.packets);
    const masalaCost = hasExtraMasala ? (packets * 5 * quantity) : 0;
    
    const item = {
      name: itemName,
      price: itemPrice,
      quantity: quantity,
      hasExtraMasala: hasExtraMasala,
      masalaCost: masalaCost
    };
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex] = item;
    } else {
      cart.push(item);
    }
  }
  
  renderCart();
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p style="color: #666; text-align: center;">Your cart is empty</p>';
    checkoutBtn.disabled = true;
    document.querySelector('.total-price').textContent = '₹0';
    return;
  }
  
  let cartHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = (item.price * item.quantity) + item.masalaCost;
    total += itemTotal;
    
    cartHTML += `
      <div class="cart-item">
        <div>
          <div><strong>${item.name}</strong> × ${item.quantity}</div>
          ${item.hasExtraMasala ? '<div style="font-size: 0.9rem; color: #666;">+ Extra Masala</div>' : ''}
        </div>
        <div><strong>₹${itemTotal}</strong></div>
      </div>
    `;
  });
  
  cartItemsDiv.innerHTML = cartHTML;
  document.querySelector('.total-price').textContent = '₹' + total;
  checkoutBtn.disabled = false;
}

function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  const checkoutCartItemsDiv = document.getElementById('checkoutCartItems');
  let cartHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = (item.price * item.quantity) + item.masalaCost;
    total += itemTotal;
    
    cartHTML += `
      <div class="checkout-item">
        <div>
          <div><strong>${item.name}</strong> × ${item.quantity}</div>
          ${item.hasExtraMasala ? '<div style="font-size: 0.85rem; color: #666;">+ Extra Masala (₹' + item.masalaCost + ')</div>' : ''}
        </div>
        <div><strong>₹${itemTotal}</strong></div>
      </div>
    `;
  });
  
  checkoutCartItemsDiv.innerHTML = cartHTML;
  document.querySelector('.total-price-checkout').textContent = '₹' + total;
  
  closeOrderModal();
  document.getElementById('checkoutModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const deliveryDetails = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    block: formData.get('block'),
    hostel: formData.get('hostel'),
    roomNumber: formData.get('roomNumber')
  };
  
  if (!/^[6-9]\d{9}$/.test(deliveryDetails.phone)) {
    alert('Please enter a valid 10-digit Indian mobile number');
    return;
  }
  
  let total = 0;
  cart.forEach(item => {
    total += (item.price * item.quantity) + item.masalaCost;
  });
  
  const orderData = {
    items: cart,
    deliveryDetails: deliveryDetails,
    totalAmount: total
  };
  
  try {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Placing Order...';
    
    const response = await fetch('/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      cart = [];
      window.location.href = '/orders/success/' + result.orderId;
    } else {
      alert('Error placing order: ' + result.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error placing order. Please try again.');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
});