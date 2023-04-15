const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info')
const popupCloseBtn = document.getElementById('close-popup');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
const resp = (await fetch('https://www.themealdb.com/api/json/v1/1/random.php'))

const respData = await resp.json();
const randomMeal = respData.meals[0]
console.log(randomMeal)

addMeal(randomMeal,true);


}

async function getMealById(id){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const respData = await resp.json()
    const meal = await respData.meals[0]
    return meal 

};
    async function getMealBySearch(term){ 
        const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term
        )
        const repsData = await resp.json();
        const meals =  repsData.meals
        return meals; 
    };

  function addMeal(mealData, random = false){
    // console.log(mealData)
    const meal = document.createElement('div');
        meal.classList.add('meal'); 
        meal.innerHTML = `
    
    <div class="meal-header">
        ${random ? ` <span class="random">
        Random Recipe
    </span>` : " "}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart"></i></button>
    </div>

    `;
    const btn = meal.querySelector(".meal-body .fav-btn")
    btn.addEventListener('click',()=>{
        if(btn.classList.contains('active')){
            removeMealFromLocalStorage(mealData.idMeal)
            btn.classList.remove("active")
        }else{
            addMealToLocalStorage(mealData.idMeal)
            btn.classList.toggle("active")
            // alert('hello')
        }
        
        fetchFavMeals()
    });
    
    meal.addEventListener('click',() => { 
        showMealInfo(mealData)
    });

    meals.appendChild(meal)
 }

 function addMealToLocalStorage(mealId){
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]) )
}

function removeMealFromLocalStorage(mealId){
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem(
        'mealIds',
        JSON.stringify(mealIds.filter((id)=>id !== mealId)));
}


 function getMealsFromLocalStorage(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds')) ;
        return mealIds === null ? [] : mealIds;
        }

async function fetchFavMeals(){
    favoriteContainer.innerHTML = '';
    const mealIds = getMealsFromLocalStorage() 

    const meals = []
    for(let i=0; i < mealIds.length; i++){
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        addMealToFav(meal)
    
    }
 
}

function addMealToFav(mealData){
    //clean the container
    // favoriteContainer.innerHTML = '';
    // console.log(mealData)
    const FavMeal = document.createElement('li');
    
   
        // meal.classList.add('meal'); 
        FavMeal.innerHTML = `
        <img 
        src="${mealData.strMealThumb}" 
        alt="${mealData.strMeal}">
        <span> ${mealData.strMeal} </span>
        <button class='clear'><i class="fa-solid fa-xmark"></i></button>

 `;
 const btn = FavMeal.querySelector('.clear')
 btn.addEventListener('click',()=>{
    removeMealFromLocalStorage(mealData.idMeal)
    fetchFavMeals()
 }) 
    favoriteContainer.appendChild(FavMeal)
 }
 function showMealInfo(mealData){
    // clean it up
    mealInfoEl.innerHTML = '';
    //update the meal Info 
    const mealEl= document.createElement('div');

    const ingredients = []
    // get ingredients and measure 
    for(let i = 0 ; i<=20; i++){
        if(mealData['strIngredient'+i]){
            ingredients.push(`${mealData['strIngredient'+i]} - 
            ${mealData['strMeasure'+i]}`);
        }
        else{
            break;
        }
    }
    mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src= 
    "${mealData.strMealThumb}" alt="">


    <p>${mealData.strInstructions}</p>
    <h3>Ingredient :</h3>
    <ul>   
    ${ingredients
        .map(
            (ing) => `
            <li>${ing}</li>`
                ) 
            .join('')} 
    </ul>
   `
    mealInfoEl.appendChild(mealEl)
    mealPopup.classList.remove('hidden')   
    
 }

 searchBtn.addEventListener('click', async () =>{
    mealsEl.innerHTML = '';
    const search = searchTerm.value;
    // console.log(await getMealBySearch(search))
    const meals = await getMealBySearch(search);
    if(meals){
        meals.forEach((meal) => {
            addMeal(meal)
        });;
       
    }
    
 });

 popupCloseBtn.addEventListener('click', () => {

    mealPopup.classList.add('hidden')
    // mealPopup.style.opacity = 0;
    // mealPopup.style.userSelect
 })
