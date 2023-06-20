export type IUser = {
  name: string
  password: string
  price: number
}

export type IUserFilters = {
  searchTerm?: string
}
export type IPriceFilters = {
  maxPrice?: number 
  minPrice?: number
}
