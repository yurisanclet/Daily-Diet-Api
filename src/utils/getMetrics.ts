import { MealProps } from "../routes/meals"
import { getMaxMealsInDietPerDay } from "./getMaxMealsInDietPerDays"

export function getUserMetrics(meals: MealProps[]){
  const mealsInDiet = meals.filter(meal => !!meal.is_diet === true)
  const mealsOutDiet = meals.filter(meal => !!meal.is_diet === false)

  const maxMealsInDietPerDay = getMaxMealsInDietPerDay(meals)

  return {
    total: meals.length,
    inDiet: mealsInDiet.length,
    outDiet: mealsOutDiet.length,
    maxMealsInDietPerDay: maxMealsInDietPerDay
  }
}