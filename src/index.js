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
  MainProductDetail: document.querySelector("#main-product-detail").content
};

const rootEl = document.querySelector('.root')

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
  const loginButtonEl = frag.querySelector(".login");
  console.log(loginButtonEl);

  // 3. 필요한 데이터 불러오기

  // 4. 내용 채우기
  console.log('aa');
  loginButtonEl.addEventListener('click', (e) => {
    console.log('click');
  })
  //버튼 클릭할 때 로그인폼 띄우기
  // loginButtonEl.addEventListener("click", e => {
  //   e.preventDefault();
  //   console.log("클릭");
  //   drawLoginForm();
  // });


  MainProductDetail();

  rootEl.textContent = ''
  rootEl.appendChild(frag)



  }

  //메인끝




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

async function MainProductDetail() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.MainEl, true);

  // 2. 요소 선택
  const mainProductListEl = frag.querySelector(".product-list");


   // 3. 필요한 데이터 불러오기
  //상품 데이터 불러오기


  const { data: productList } = await api.get("/products", {
    params: {
      _embed: "options",
    }
  });

  // 4. 내용 채우기
  //상품 리스트 가져오기
  for (const productItem of productList ) {
    //li리스트 템플릿 복사
    const frag = document.importNode(templates.MainProductDetail, true);

    //li 리스트 안에 요소 선택
    const mainProductImgEl = frag.querySelector(".product_img>img");
    const titleEl = frag.querySelector(".title");
    const priceEl = frag.querySelector(".price");

    titleEl.textContent = productItem.title;
    priceEl.textContent = productItem.options[0].price;
    // console.log(productItem);

    mainProductImgEl.setAttribute("src",productItem.mainImgUrl);


    mainProductListEl.appendChild(frag);

  }

  rootEl.textContent = "";
  rootEl.appendChild(frag);

}

drawMain();

