const products = [
  {id:1,name:'Camiseta Beco Essential',price:89.90,category:'Camisetas',description:'Modelagem confortável com identidade Beco58.',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85',tag:'ESSENCIAL'},
  {id:2,name:'Moletom 58 Core',price:169.90,category:'Moletons',description:'Peso ideal e presença forte para os dias frios.',image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85',tag:'BEST-SELLER'},
  {id:3,name:'Cargo Beco Utility',price:189.90,category:'Calças',description:'Funcionalidade e atitude em cada detalhe.',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',tag:'NOVO'},
  {id:4,name:'Boné B58 Classic',price:69.90,category:'Acessórios',description:'O acabamento que completa seu corre.',image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85',tag:'DROP 01'},
  {id:5,name:'Camiseta No Rules',price:99.90,category:'Camisetas',description:'Estampa exclusiva para quem não segue roteiro.',image:'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=85',tag:'DROP 01'},
  {id:6,name:'Bermuda Street 58',price:119.90,category:'Bermudas',description:'Leveza para acompanhar todos os caminhos.',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',tag:'NOVO'},
  {id:7,name:'Jaqueta Beco Track',price:219.90,category:'Jaquetas',description:'Camada urbana com design marcante.',image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85',tag:'LIMITADO'},
  {id:8,name:'Shoulder Bag 58',price:79.90,category:'Acessórios',description:'Praticidade compacta para levar seu essencial.',image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85',tag:'ESSENCIAL'}
];
const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let cart = JSON.parse(localStorage.getItem('beco58-cart') || '[]');
let activeCategory = 'Todos';
const grid = document.querySelector('#products-grid');
const categories = document.querySelector('#categories');
function renderCategories(){
  const list = ['Todos', ...new Set(products.map(p=>p.category))];
  categories.innerHTML = list.map(c=>`<button class="category ${c===activeCategory?'active':''}" data-category="${c}">${c}</button>`).join('');
  categories.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.category;renderCategories();renderProducts();}));
}
function renderProducts(){
  const visible = activeCategory==='Todos' ? products : products.filter(p=>p.category===activeCategory);
  grid.innerHTML = visible.map(p=>`<article class="product-card"><div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}"/><span class="product-tag">${p.tag}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" aria-label="Adicionar ${p.name}" data-add="${p.id}">+</button></div></div></article>`).join('');
  grid.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>addToCart(Number(btn.dataset.add))));
}
function addToCart(id){const item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();showToast('Produto adicionado ao carrinho');}
function saveCart(){localStorage.setItem('beco58-cart',JSON.stringify(cart));renderCart();}
function renderCart(){
  const count=cart.reduce((sum,i)=>sum+i.qty,0);document.querySelector('#cart-count').textContent=count;
  const items=document.querySelector('#cart-items');
  if(!cart.length){items.innerHTML='<div class="empty-cart">Seu carrinho está vazio.<br /><a href="#produtos" id="go-products">Explore a coleção ↗</a></div>';document.querySelector('#cart-total').textContent=money(0);return;}
  items.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-line"><img src="${p.image}" alt="${p.name}"/><div><h4>${p.name}</h4><small>${item.qty} × ${money(p.price)}</small></div><button class="remove" data-remove="${p.id}" aria-label="Remover ${p.name}">×</button></div>`}).join('');
  items.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{cart=cart.filter(i=>i.id!==Number(btn.dataset.remove));saveCart();}));
  document.querySelector('#cart-total').textContent=money(cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0));
}
function toggleCart(open){const drawer=document.querySelector('#cart-drawer'),overlay=document.querySelector('#cart-overlay');drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));overlay.hidden=!open;document.body.style.overflow=open?'hidden':'';}
function showToast(text){const toast=document.querySelector('#toast');toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
document.querySelector('#open-cart').addEventListener('click',()=>toggleCart(true));document.querySelector('#close-cart').addEventListener('click',()=>toggleCart(false));document.querySelector('#cart-overlay').addEventListener('click',()=>toggleCart(false));
document.querySelector('#checkout').addEventListener('click',()=>{if(!cart.length){showToast('Adicione um produto primeiro');return;}const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} (${i.qty}x) — ${money(p.price*i.qty)}`}).join('%0A');const total=money(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0));window.open(`https://wa.me/5531998828857?text=Olá! Quero fazer um pedido na BECO58.STORE:%0A%0A${lines}%0A%0ATotal: ${total}`,'_blank');});
renderCategories();renderProducts();renderCart();
