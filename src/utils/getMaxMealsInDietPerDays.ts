import { MealProps } from "../routes/meals";

export function getMaxMealsInDietPerDay(meals: MealProps[]){
  const mealsInDiet = meals.filter(meal => meal.is_diet);

  if (mealsInDiet.length === 0) {
    return {};
  }

  const mealsPerDay = mealsInDiet.reduce<{ [data: string]: number }>((groups, meal) => {
    const data = new Date(meal.created_at)
    const valueDate = data.toISOString().slice(0, 10);
    if (!groups[valueDate]) {
      groups[valueDate] = 0;
    }
    groups[valueDate]++;
    return groups;
  }, {});

  return mealsPerDay;
}