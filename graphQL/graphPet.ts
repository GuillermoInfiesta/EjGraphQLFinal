import { petModel, petModelType } from "../collections/Pet.ts";

type Pet = {
    id: string;
    name: string;
    breed: string;
  }
  
  //El ! indica que son campos obligatorios
  export const gqlSchema = `#graphql
    type Pet{
      id: ID! 
      name: String!
      breed: String!
    }
  
    type Query{
      pets: [Pet!]!
      pet(id: ID!): Pet!
      petsByBreed(breed: String!): [Pet!]!
    }
  
    type Mutation{
      addPet(name: String!, breed: String!): Pet!
      deletePet(id: ID!): String!
      updatePet(id: ID!, name: String!, breed: String!): Pet!
    }
  `;
  
  
  export const Query = {
    pets: async ():Promise<Pet[]> => {
      const mongoPets = await petModel.find().exec();
      const pets = mongoPets.map((pet):Pet => {
        return {
            id: pet._id.toString(),
            name: pet.name,
            breed: pet.breed,
        }
      })
      return pets;
    },
    pet: async(_: unknown, args: {id: string}):Promise<Pet> => {
        const pet = await petModel.findById(args.id).exec();
        if(!pet) throw new Error(`Pet not found`);
        return{
            id: pet._id.toString(),
            name: pet.name,
            breed: pet.breed
        }
    },
    petsByBreed: async(_:unknown, args: {breed: string}):Promise<Pet[]> => {
        const pets = await petModel.find().where("breed").equals(args.breed).exec();
        const finalpets = pets.map((pet):Pet => {
            return {
                id: pet._id.toString(),
                name: pet.name,
                breed: pet.breed,
            }
          })
        return finalpets;
    }
  }
  
  export const Mutation = {
    addPet: async(_: unknown, args: {name: string, breed: string}):Promise<Pet> => {
        const { name, breed} = args;
        const newPet = await petModel.create({ 
            name, 
            breed
        })
        return {
            id: newPet._id.toString(),
            name: newPet.name,
            breed: newPet.breed
        }
    },
  
    deletePet: async(_: unknown, args: {id: string}):Promise<string> => {
      const {id} = args;
      await petModel.findOneAndDelete().where("_id").equals(id).exec();
      return `Pet deleted`
    },
  
    updatePet: async(_: unknown, args: {id: string, name: string, breed: string}):Promise<Pet> => {
      const {id, name, breed} = args;
      await petModel.findOneAndUpdate({_id: id},{name: name, breed: breed}).exec();
      return{id, name, breed}
    }
  }
  