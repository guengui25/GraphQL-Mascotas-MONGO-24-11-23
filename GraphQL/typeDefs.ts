// The GraphQL schema -> El esquema de grapgh ql es un string ; para que salgan colores -> #graphql

// Se define TODO lo que ofrece la  API

export const typeDefs = `#graphql
  
  # Cuando el tipo es obligatorio se pone -> ! ; Cuando es optativo no se pone nada

  type Pet {
    id: ID!
    name: String!
    breed: String!
  }
  
  # Query -> son las funciones para las peticiones de datos

  type Query {
    pets (breed:String) : [Pet!]!   # Pide todas las mascotas -> Devuelve un array [Pet] (Pet de graphql)
                                    # Agrego un argumento a la query pets -> Devuelve todas las mascotas de una raza determinada 
                                      # si está el argumento, si no, devuelve todas las mascotas

    pet(id: ID!): Pet!    # Pide una mascota por id
                              # Recibe un id de tipo ID! y SIEMPRE va a devolver un ID -> Por la exclamación
  }
  
  # Mutation -> son las funciones para las peticiones de modificación de datos

  type Mutation {
    addPet(name: String!, breed: String!): Pet! # Añade una mascota -> Devuelve un Pet

    deletePet(id: ID!): Pet! # Borra una mascota -> Devuelve un Pet 

    updatePet(id: ID!, name: String!, breed: String!): Pet! # Actualiza una mascota -> Devuelve un Pet
  }
`;