const PRODUCTS = [
  { id:1, name:"ProBook X1 Laptop", category:"Laptops", price:1299.00, stock:14, description:"14-inch IPS display, Intel Core i7, 16GB RAM, 512GB NVMe SSD. Thunderbolt 4, Wi-Fi 6E.", icon:"[NB]" },
  { id:2, name:"SoundForce Pro Headphones", category:"Audio", price:149.00, stock:32, description:"40mm drivers, active noise cancellation, 30-hour battery. USB-C and 3.5mm.", icon:"[AUD]" },
  { id:3, name:"MechaKey RGB Keyboard", category:"Peripherals", price:89.00, stock:27, description:"Tenkeyless mechanical keyboard, Cherry MX Brown switches, per-key RGB lighting.", icon:"[KB]" },
  { id:4, name:'UltraView 27" Monitor', category:"Displays", price:449.00, stock:8, description:'27-inch 4K IPS panel, 144Hz, HDR400, USB-C 65W power delivery, 1ms response.', icon:"[MON]" },
  { id:5, name:"PrecisionX Mouse", category:"Peripherals", price:59.00, stock:45, description:"16000 DPI optical sensor, 6 programmable buttons, 70-hour battery, 2.4GHz wireless.", icon:"[MS]" },
  { id:6, name:"HubConnect Pro 7-Port", category:"Accessories", price:39.00, stock:61, description:"USB-C hub: 2x USB-A 3.0, 2x USB-C, HDMI 4K, SD card slot, 100W PD pass-through.", icon:"[HUB]" },
  { id:7, name:"ClearCam 4K Webcam", category:"Accessories", price:79.00, stock:19, description:"4K 30fps / 1080p 60fps, autofocus, dual stereo mics with noise cancellation, privacy shutter.", icon:"[CAM]" },
  { id:8, name:"SpeedDrive 1TB SSD", category:"Storage", price:119.00, stock:36, description:"NVMe M.2 SSD, 7,000MB/s read, 6,500MB/s write, 5-year warranty, PCIe 4.0.", icon:"[SSD]" },
];

let currentCategory = 'all';

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!products.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--grey-400);font-size:.875rem;">No products found in this category.</div>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="window.location='/search.html?q=${encodeURIComponent(p.name)}'">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <div class="product-cat">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <span class="product-stock ${p.stock === 0 ? 'out' : ''}">${p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = cat;
  const title = document.getElementById('gridTitle');
  title.textContent = cat === 'all' ? 'Featured Products' : cat;
  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  renderProducts(filtered);
}

function performSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if (q) window.location.href = '/search.html?q=' + encodeURIComponent(q);
}

renderProducts(PRODUCTS);
