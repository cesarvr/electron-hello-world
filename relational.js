/*
 *
 *  Testing bi-directional relationship in Realm.
 *
 */

let Realm = require('realm')

const PersonSchema = {
  name: '_Person',
  properties: {
    name: 'string',
    dogs: '_Dog[]'
  }
};

const DogSchema = {
  name:'_Dog',
  properties: {
    name: 'string',
    owners: {type: 'linkingObjects', objectType: '_Person', property: 'dogs'}
  }
}

async function run(){
  let realm = await Realm.open({schema: [DogSchema, PersonSchema]})

  console.log('Testing Schema Relations')

  if( realm.objects('_Person').filtered(`name = "ben"`).length  == 0 ) {
    console.log('Empty DB creating one...')

    realm.write(() => {
      realm.create('_Person', {
        name: 'ben',
        dogs: [
          {
            name: 'a'
          },
          {
            name: 'b'
          }
        ],
      })
    })

  }else{
    console.log('There is one already...continue...')
  }

  const eb = realm.objects('_Dog').filtered(`name = "a"`)
  console.log('eb Dog: ', eb[0].name)
  console.log('Dog size: ', eb.length)

  const listOfUsers = realm.objects('_Person').filtered(`name = "ben"`)
  console.log('What is this: ', typeof listOfUsers, `Is this an Array ${Array.isArray(listOfUsers)}`)
  console.log('What is this: ', listOfUsers.length)

  let Ben = listOfUsers[listOfUsers.length - 1]

  console.log('User (Parent Node)->', Ben.name)

  Ben.dogs.forEach(dog => 
    console.log(`Dog Owner (reverse relationship): ${dog.owners[0].name} -> Dog Name ${dog.name}`, ))
  console.log('Ben json ->', Ben.toJSON())

  realm.close()
}

//run()
module.exports = run
