/* PETSHOP SOPHIE
   IMPORTANTE: troque o número abaixo pelo WhatsApp do vendedor.
   Use código do país + DDD + número, somente dígitos. Ex.: 5511961716196
*/
const WHATSAPP_NUMBER = "5511974007146"; // <-- ALTERE AQUI

const products = [
  { id: 1, name: "Ração Premium para Cães", category: "Rações", price: 89.90, tag: "Queridinho", description: "Nutrição completa para uma rotina cheia de energia.", image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&w=700&q=85", alt: "Cachorro feliz" },
  { id: 2, name: "Ração para Gatos", category: "Rações", price: 64.90, tag: "", description: "Sabor e cuidado para os ronrons de todos os dias.", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=85", alt: "Gato olhando para a câmera" },
  { id: 3, name: "Coleira com Guia", category: "Acessórios", price: 39.90, tag: "Praticidade", description: "Passeios confortáveis com muito estilo e segurança.", image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=700&q=85", alt: "Cachorro usando coleira" },
  { id: 4, name: "Caminha Aconchegante", category: "Acessórios", price: 119.90, tag: "Conforto", description: "Um cantinho macio para o seu melhor amigo descansar.", image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=700&q=85", alt: "Caminha confortável para pet" },
  { id: 5, name: "Brinquedo Mordedor", category: "Brinquedos", price: 24.90, tag: "Diversão", description: "Mais brincadeira, estímulo e momentos felizes.", image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=700&q=85", alt: "Cachorro brincando" },
  { id: 6, name: "Ratinho de Brinquedo", category: "Brinquedos", price: 14.90, tag: "Para gatinhos", description: "Diversão para despertar a curiosidade do seu gato.", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=85", alt: "Gato brincalhão" },
  { id: 7, name: "Kit de Higiene Pet", category: "Higiene", price: 32.90, tag: "Cuidados", description: "Itens para ajudar a manter seu companheiro limpinho.", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=85", alt: "Cão recebendo cuidados" },
  { id: 8, name: "Pote Duplo para Ração", category: "Acessórios", price: 29.90, tag: "Útil no dia a dia", description: "Praticidade para servir água e comida com organização.", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=85", alt: "Cachorro em casa" }
];

let cart = [];
let activeCategory = "Todos";
let toastTimeout;
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const productTotal = document.getElementById("productTotal");
const emptyState = document.getElementById("emptyState");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function renderProducts() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const visible = products.filter(p => (activeCategory === "Todos" || p.category === activeCategory) && `${p.name} ${p.category} ${p.description}`.toLocaleLowerCase("pt-BR").includes(term));
  productGrid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.alt}" loading="lazy" onerror="this.onerror=null;this.src='assets/icone-pets.png';this.style.objectFit='contain';this.style.padding='18px';" />
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
      </div>
      <div class="product-details"><span class="product-category">${p.category}</span><h3 class="product-name">${p.name}</h3><p class="product-description">${p.description}</p><div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">+ Adicionar</button></div></div>
    </article>`).join("");
  productTotal.textContent = `${visible.length} ${visible.length === 1 ? "produto" : "produtos"}`;
  emptyState.classList.toggle("hidden", visible.length !== 0);
  productGrid.classList.toggle("hidden", visible.length === 0);
}
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
  showToast(`${product.name} adicionado ao carrinho!`);
}
function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
  renderCart();
}
function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  renderCart();
  showToast("Produto removido do carrinho.");
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  document.getElementById("cartSubtotal").textContent = money(subtotal);
  cartEmpty.classList.toggle("hidden", count > 0);
  cartFooter.classList.toggle("hidden", count === 0);
  cartItems.classList.toggle("hidden", count === 0);
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item"><img src="${item.image}" alt="${item.alt}" onerror="this.onerror=null;this.src='assets/icone-pets.png';this.style.objectFit='contain';" /><div><div class="cart-item-name">${item.name}</div><div class="cart-item-price">${money(item.price * item.quantity)}</div><div class="quantity-control"><button data-qty="${item.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button data-qty="${item.id}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div><button class="remove-item" data-remove="${item.id}" aria-label="Remover ${item.name}">✕</button></div>`).join("");
}
function openCart() {
  cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); cartDrawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); cartDrawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
}
function showToast(message) {
  const toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => toast.classList.remove("show"), 2500);
}
function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function contactSeller() {
  const message = "Olá! Vim pelo site da Petshop Sophie e gostaria de saber mais sobre os produtos.";
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}
function checkout() {
  if (!cart.length) return;
  if (WHATSAPP_NUMBER === "5511999999999") {
    showToast("Antes de usar, configure o WhatsApp do vendedor no arquivo script.js.");
    return;
  }
  const lines = cart.map(item => `• ${item.name} — ${item.quantity} x ${money(item.price)} = ${money(item.price * item.quantity)}`);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Olá! Quero fazer um pedido na Petshop Sophie 🐾\n\n${lines.join("\n")}\n\n*Subtotal dos produtos: ${money(subtotal)}*\n\nPoderia confirmar a disponibilidade, o valor da entrega e as formas de pagamento?`;
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
document.querySelector(".filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.qty), Number(quantityButton.dataset.delta));
  if (removeButton) removeItem(Number(removeButton.dataset.remove));
});
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", () => { closeCart(); document.getElementById("produtos").scrollIntoView({ behavior: "smooth" }); });
document.getElementById("checkoutButton").addEventListener("click", checkout);
document.getElementById("contactWhatsApp").addEventListener("click", event => { event.preventDefault(); if (WHATSAPP_NUMBER === "5511999999999") { showToast("Configure o WhatsApp do vendedor no arquivo script.js."); return; } contactSeller(); });
document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav"); const open = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(open));
  document.getElementById("menuToggle").setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => { document.getElementById("mainNav").classList.remove("open"); document.getElementById("menuToggle").setAttribute("aria-expanded", "false"); }));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts(); renderCart();
