// Dữ liệu mẫu sản phẩm kèm ảnh
const PRODUCTS = [
  {
    id: 1,
    name: 'Laptop A - 14" | i5',
    price: 11990000,
    desc: '14 inch, i5, 8GB RAM',
    img: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6411/6411083cv14d.jpg'
  },
  {
    id: 2,
    name: 'Laptop B - 15" | i7',
    price: 18990000,
    desc: '15 inch, i7, 16GB RAM',
    img: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6441/6441542_rd.jpg'
  },
  {
    id: 3,
    name: 'Laptop C - Ultrabook',
    price: 22990000,
    desc: '13 inch, M series/Ultrabook',
    img: 'https://www.notebookcheck.com/uploads/tx_jppageteaser/900X3E_010_right-angle-45_mineral_ash_black_01.jpg'
  },
  {id: 4,
    name: 'Laptop C - Ultrabook',
    price: 25990000,
    desc: '13 inch, M series/Ultrabook',
    img: 'https://www.phucanh.vn/media/news/2312_laptop-moi-cua-lenovo-1.jpg'
  }
];

// Helpers
function formatVND(n) {
  return n.toLocaleString('vi-VN') + ' ₫';
}

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  document.querySelectorAll('#cart-count, #cart-count-2').forEach(el => {
    if (el) el.textContent = cart.length;
  });
}

// Render products on index
function renderProducts() {
  const el = document.getElementById('products');
  if (!el) return;
  el.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="price">${formatVND(p.price)}</span>
      <button data-id="${p.id}" class="add-cart">Thêm vào giỏ</button>
    `;
    el.appendChild(card);
  });
}

// Add to cart handler
function addToCart(id) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const prod = PRODUCTS.find(p => p.id === id);
  if (prod) {
    cart.push(prod);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Đã thêm vào giỏ hàng');
  }
}

// Init
renderProducts();
updateCartCount();


// Render cart page
function renderCartPage(){
  const el = document.getElementById('cart-list'); if(!el) return;
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  if(cart.length===0){ el.innerHTML = '<p>Giỏ hàng trống.</p>'; document.getElementById('cart-total').textContent=''; return }
  let html = '<ul>';
  let total = 0;
  cart.forEach((it, idx)=>{ html += `<li class="card">${it.name} - ${formatVND(it.price)} <button data-idx="${idx}" class="remove-item">Xóa</button></li>`; total += it.price });
  html += '</ul>';
  el.innerHTML = html;
  document.getElementById('cart-total').textContent = 'Tổng: ' + formatVND(total);
}

// Remove from cart
function removeFromCart(idx){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  cart.splice(idx,1); localStorage.setItem('cart', JSON.stringify(cart)); renderCartPage(); updateCartCount();
}

// Contact form handler
function handleContact(){
  const form = document.getElementById('contact-form'); if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg = document.getElementById('contact-message').value.trim();
    if(!name||!email||!msg){ document.getElementById('contact-result').textContent='Vui lòng điền đầy đủ thông tin.'; return }
    document.getElementById('contact-result').textContent='Cảm ơn! Chúng tôi đã nhận được tin nhắn.';
    form.reset();
  })
}

// Register validation & storage
function handleRegister(){
  const form = document.getElementById('register-form'); 
  if(!form) return;

  form.addEventListener('submit', e=>{
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const pw = document.getElementById('reg-password').value;
    const pw2 = document.getElementById('reg-password2').value;

    const err = document.getElementById('register-error'); 
    err.textContent = '';

    // Kiểm tra dữ liệu
    if(!name || !email || !phone || !address){
      err.textContent = 'Vui lòng điền đầy đủ thông tin.';
      return;
    }
    if(!/^[0-9]{10}$/.test(phone)){
      err.textContent = 'Số điện thoại phải gồm 10 chữ số.';
      return;
    }
    if(pw.length < 6){
      err.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return;
    }
    if(pw !== pw2){
      err.textContent = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    // Lưu thông tin người dùng (demo, chưa mã hóa)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if(users.find(u=>u.email === email)){
      err.textContent = 'Email đã được sử dụng.';
      return;
    }

    users.push({ name, email, phone, address, password: pw });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công. Vui lòng đăng nhập.');
    window.location.href = 'login.html';
  });
}

// Render profile
function renderProfile(){
  const el = document.getElementById('profile-info'); 
  if(!el) return;

  const cur = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if(!cur){
    el.innerHTML = '<p>Bạn chưa đăng nhập. <a href="login.html">Đăng nhập</a></p>';
    return;
  }

  el.innerHTML = `
    <p><strong>Họ tên:</strong> ${cur.name}</p>
    <p><strong>Email:</strong> ${cur.email}</p>
    ${cur.phone ? `<p><strong>Số điện thoại:</strong> ${cur.phone}</p>` : ''}
    ${cur.address ? `<p><strong>Địa chỉ:</strong> ${cur.address}</p>` : ''}
  `;

  const logout = document.getElementById('logout-link'); 
  if(logout){
    logout.addEventListener('click', ev=>{
      ev.preventDefault(); 
      localStorage.removeItem('currentUser'); 
      window.location.href = 'index.html';
    });
  }
}

// Login validation (giữ nguyên, nhưng lưu phone & address vào currentUser)
function handleLogin(){
  const form = document.getElementById('login-form'); 
  if(!form) return;

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const err = document.getElementById('login-error'); 
    err.textContent = '';

    const user = users.find(u=>u.email === email && u.password === pw);
    if(!user){
      err.textContent = 'Email hoặc mật khẩu không đúng.';
      return;
    }

    // Lưu cả số điện thoại và địa chỉ
    localStorage.setItem('currentUser', JSON.stringify({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || ''
    }));

    window.location.href = 'profile.html';
  });
}


// Render profile
function renderProfile(){
  const el = document.getElementById('profile-info'); if(!el) return;
  const cur = JSON.parse(localStorage.getItem('currentUser')||'null');
  if(!cur){ el.innerHTML = '<p>Bạn chưa đăng nhập. <a href="login.html">Đăng nhập</a></p>'; return }
  el.innerHTML = `
    <p><strong>Họ tên:</strong> ${cur.name}</p>
    <p><strong>Email:</strong> ${cur.email}</p>
  `;
  const logout = document.getElementById('logout-link'); if(logout){ logout.addEventListener('click', ev=>{ ev.preventDefault(); localStorage.removeItem('currentUser'); window.location.href='index.html' }) }
}

// Attach generic listeners
document.addEventListener('click', function(e){
  if(e.target.classList.contains('add-cart')){ addToCart(Number(e.target.dataset.id)) }
  if(e.target.classList.contains('remove-item')){ removeFromCart(Number(e.target.dataset.idx)) }
  if(e.target.id === 'checkout-btn'){
    alert('Thanh toán demo — tích hợp cổng thanh toán nếu cần'); localStorage.removeItem('cart'); renderCartPage(); updateCartCount();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount(); renderProducts(); renderCartPage(); handleContact(); handleRegister(); handleLogin(); renderProfile();
});
