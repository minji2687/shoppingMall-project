import '@babel/polyfill' // 이 라인을 지우지 말아주세요!

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL
})

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
});

const templates = {
  loginForm: document.querySelector("#login-form").content,
  MainEl: document.querySelector("#main").content,
  MainProductDetail: document.querySelector("#main-product-detail").content,
  ProductDetailPage: document.querySelector("#product-detail-page").content,
  Cart: document.querySelector("#cart").content,
  cartItem: document.querySelector("#cart-item").content

};

const rootEl = document.querySelector('.root')

// fragment를 받아서 layout에 넣은 다음 rootEl에 그려주는 함수





// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입





//메인시작

async function drawMain(){
  // 1. 템플릿 복사
  //메인 템플릿 복사

  const frag = document.importNode(templates.MainEl, true)

  // 2. 요소 선택


  //로그인 버튼 선택


  // 3. 필요한 데이터 불러오기
  MainProductDetail();


  // rootEl.textContent = ''
  rootEl.appendChild(frag)




  }




async function drawLoginForm() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.loginForm, true);

  // 2. 요소 선택
  const formEl = frag.querySelector(".login-form");

  // 3. 필요한 데이터 불러오기 - 필요없음
  // 4. 내용 채우기 - 필요없음
  // 5. 이벤트 리스너 등록하기
  formEl.addEventListener("submit", async e => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    const res = await api.post("/users/login", {
      username,
      password
    });

    localStorage.setItem("token", res.data.token);
    drawMain();
  });


  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

//메인 리스트 세부사항

async function MainProductDetail(category) {

  console.log(category);

  // 1. 템플릿 복사
  const frag = document.importNode(templates.MainEl, true);

  // 2. 요소 선택
  const mainProductListEl = frag.querySelector(".product-list");


   // 3. 필요한 데이터 불러오기
  //상품 데이터 불러오기
  const params = {
    _embed: 'options'
  }
  if (category) {
    params.category = category
  }

  const { data: productList } = await api.get("/products", {
    params
  });



  // 4. 내용 채우기
  //상품 리스트 가져오기
  for (const productItem of productList ) {

    const frag = document.importNode(templates.MainProductDetail, true);
     //li리스트 템플릿 복사
    const productListEl = frag.querySelector(".product-item")

    //li 리스트 안에 요소 선택
    const mainProductImgEl = frag.querySelector(".product_img>img");
    const titleEl = frag.querySelector(".title");
    const priceEl = frag.querySelector(".price");


    //요소안에 데이터 넣어주기
    titleEl.textContent = productItem.title;
    priceEl.textContent = productItem.options[0].price;

    //이미지 요소안에 이미지 넣어주기
    mainProductImgEl.setAttribute("src",productItem.mainImgUrl);


    productListEl.addEventListener("click", e => {

      ProductDetailPage(productItem.id);
    });

    mainProductListEl.appendChild(frag);


  }




  rootEl.textContent = "";
  rootEl.appendChild(frag);

}



//상세페이지 띄우기
async function ProductDetailPage(productId) {


  // 1. 템플릿 복사
  const frag = document.importNode(templates.ProductDetailPage, true);


  // 3. 필요한 데이터 불러오기
  //상품 데이터 불러오기
  const { data: productData } = await api.get('/products/' + productId, {
    params: {
      _embed: "options"
    }
  });

    //li 리스트 안에 요소 선택
    const detailPageProductImgEl = frag.querySelector(".detail-page-product-img>img");
    const titleEl = frag.querySelector(".detail-page-title");
    const priceEl = frag.querySelector(".detail-page-price");
    const descriptionEl = frag.querySelector(".detail-text");
    const cartBtnEl = frag.querySelector(".cart-btn");
    const selectEl = frag.querySelector('.option > option');
    const quantityEl = frag.querySelector('.quantity');


  //데이터 넣어주기
  console.log(productData);
  titleEl.textContent = productData.title;
  priceEl.textContent = productData.options[0].price;
  descriptionEl.textContent = productData.description;
  selectEl.textContent = productData.options[0].title;
detailPageProductImgEl.setAttribute("src", productData.mainImgUrl);



  // 카트를 눌렀을 때
  // 5. 이벤트 리스너 등록하기
  cartBtnEl.addEventListener("click", async e => {

// 페이지 그리는 함수 작성 순서
// 2. 요소 선택
    const optionId = selectEl.value;
    const quantity = quantityEl.value;
    const price = productData.options[0].price;
    const title = productData.options[0].title;
    const image =productData.mainImgUrl;
// 3. 필요한 데이터 불러오기


  const res =  await api.post('/cartItems', {
      title,
      image,
      price,
      optionId,
      quantity,
      ordered: false
    })


    cart();

  });
  rootEl.textContent = "";
  rootEl.appendChild(frag);



}


// 카트페이지 띄우기
async function cart() {



      // 1. 템플릿 복사
      const frag = document.importNode(templates.Cart, true);

      const cartList = frag.querySelector(".cart-list")


      // 3. 필요한 데이터 불러오기

      const { data: cartItemList } = await api.get("/cartItems", {
        params: {
          ordered: false,
        }
      });

      //데이터 넣어주기
      for(const cartItem of cartItemList){
        console.log(cartItem)
          // 페이지 그리는 함수 작성 순서
    // 1. 템플릿 복사
        const frag = document.importNode(templates.cartItem, true)

    // 2. 요소 선택
        const cartItemEl = frag.querySelector('.cart-item')
        const cartImg = frag.querySelector(".cart-product-img>img");
        const cartTitle = frag.querySelector(".cart-page-title");
        const cartPrice = frag.querySelector(".cart-page-price");
    // 3. 필요한 데이터 불러오기-없음
    // 4. 내용 채우기
        cartImg.setAttribute("src", cartItem.image);
        cartTitle.textContent = cartItem.title
        cartPrice.textContent = cartItem.price
    // 5. 이벤트 리스너 등록하기
    // BuyBtnEl.addEventListener("click", e => {
      //   e.preventDefault();
      //   console.log("클릭");
      //   cart();
      // });
    // 6. 템플릿을 문서에 삽입
        cartList.appendChild(cartItemEl)

      }

      rootEl.textContent = "";
      rootEl.appendChild(frag);
}



// 헤더 관련 작업

const loginButtonEl = document.querySelector(".login");
console.log(loginButtonEl)
console.log(templates.HeaderEl)

// 3. 필요한 데이터 불러오기

// 4. 내용 채우기
loginButtonEl.addEventListener("click", e => {
  e.preventDefault();
  console.log("클릭");
  drawLoginForm();

});

//   카테고리 관련 작업

const caseEl = document.querySelector(".case-item");
const cableEl = document.querySelector(".cable-item");
const othersEl = document.querySelector(".others-item");

caseEl.addEventListener("click", e => {
  MainProductDetail("case");
});
cableEl.addEventListener("click", e => {
  MainProductDetail("cable");
});
othersEl.addEventListener("click", e => {
  MainProductDetail("others");
});




drawMain();
// cart()
