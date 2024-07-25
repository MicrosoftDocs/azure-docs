---
title":  Different indexing options on Azure Cosmos DB for MongoDB vCore
titleSuffix": Azure Cosmos DB for MongoDB vCore
description": Basic know-how for efficient usage of indexes on Azure Cosmos DB for MongoDB vCore.
author": avijitgupta
ms.author": avijitgupta
ms.reviewer": gahllevy
ms.service": cosmos-db
ms.subservice": mongodb-vcore
ms.topic": conceptual
ms.date": 07/23/2024
---

# Working with indexes in Azure Cosmos DB for MongoDB vcore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Indexes are structures that enhance data retrieval speed by enabling quick access to specific fields within a collection. This article explains how to perform indexing at various nesting levels and reviews how to effectively utilize these indexes for optimal performance.

## Indexing scenarios

We would review indexing scenarios against the sample json.

```json
{
  "_id": "e79b564e-48b1-4f75-990f-e62de2449239",
  "car_id":"AZ-9874532",
  "car_info": {
    "make": "Mustang",
    "model": "GT Fastback",
    "year": 2024,
    "registration": {
      "license_plate": "LJX386",
      "state": "WV",
      "registration_datetime": {
        "$date": "2024-01-10T01:16:44.000Z"
      },
      "expiration_datetime": {
        "$date": "2034-01-10T01:16:44.000Z"
      }
    }
  },
  "rental_history": [
    {
      "rental_id": "RT63857499825952",
      "customer_id": "CX8716",
      "start_date": {
        "$date": "2024-02-29T01:16:44.000Z"
      },
      "end_date": {
        "$date": "2024-03-04T16:54:44.000Z"
      },
      "pickup_location": { "type": "Point", "coordinates": [ -73.97, 40.77 ]
      },
      "drop_location": { "type": "Point", "coordinates": [ -73.96, 40.78 ]
      },
      "total_price": 232.56944444444443,
      "daily_rent": 50,
      "complains": [ 
        {
          "complain_id": "CMP638574998259520",
          "issue": "Strange odor inside the car.",
          "reported_datetime": {
            "$date": "2024-03-03T20:11:44.000Z"
          },
          "reported_medium": "Website",
          "resolutions": [
            {
              "resolution_datetime": {
                "$date": "2024-03-03T20:20:44.000Z"
              },
              "solution": "Inspect for any leftover food, spills, or trash that might be causing the odor. Contact the rental agency.",
              "resolved": true
            }
          ]
        }
      ],
      "accidents": [
        {
          "accident_id": "ACC376184",
          "date": {
            "$date": "2024-03-03T01:47:44.000Z"
          },
          "description": "Collisions with Soft Barriers: Accidents involving hitting bushes, shrubs, or other soft barriers.",
          "repair_cost": 147
        }
      ]
    },
    {
      "rental_id": "RT63857499825954",
      "customer_id": "CX1412",
      "start_date": {
        "$date": "2033-11-18T01:16:44.000Z"
      },
      "end_date": {
        "$date": "2033-11-25T21:11:44.000Z"
      },
      "pickup_location": { "type": "Point", "coordinates": [ 40, 5 ]
      },
      "drop_location": { "type": "Point", "coordinates": [ 41, 11 ]
      },
      "total_price": 305.3645833333333,
      "daily_rent": 39,
      "complains": [
        {
          "complain_id": "CMP638574998259540",
          "issue": "Unresponsive infotainment system.",
          "reported_datetime": {
            "$date": "2033-11-19T17:55:44.000Z"
          },
          "reported_medium": "Agency",
          "resolutions": []
        }
      ],
      "accidents": null
    }
  ],
  "junk": null
}
```

### Indexing the root field

Azure Cosmos DB for MongoDB vcore create indexes on root properties using syntax outlined and review the utilization with `explain`.

```javascript
// Indexing the root property
db.sampleCollection.createIndex({"car_id":1})

// review index getting utilized
[mongos] CarData> db.sampleColl.find({"car_id":"ZA-XWB804"}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'sampleColl', 'filter' : { 'car_id' : 'ZA-XWB804' } }})",
  explainCommandPlanningTimeMillis: 0.156,
  explainCommandExecTimeMillis: 37.956,
  dataSize: '32 kB',
  queryPlanner: {
    namespace: 'CarData.sampleColl',
    winningPlan: {
      stage: 'FETCH',
      estimatedTotalKeysExamined: 8700,
      inputStage: {
        stage: 'IXSCAN',
        indexName: 'car_id_1',
        isBitmap: true,
        indexFilterSet: [ { '$eq': { car_id: 'ZA-XWB804' } } ],
        estimatedTotalKeysExamined: 174
      }
    }
  },
  ok: 1
}
```

### Indexing the nested properties

Azure Cosmos DB for MongoDB vcore supports indexing embedded document properties.

```javascript
// Indexing the properties in nested document
[mongos] Cosmicworks> db.sampleColl.createIndex({"car_info.registration.registration_datetime":1})

[mongos] CarData> db.sampleColl.find({"car_info.registration.registration_datetime":
                                            { $gte : new ISODate("2024-05-01"),$lt: ISODate("2024-05-07")}}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'sampleColl', 'filter' : { 'car_info.registration.registration_datetime' : { '$gte' : ISODate('2024-05-01T00:00:00Z'), '$lt' : ISODate('2024-05-07T00:00:00Z') } } }})",
  explainCommandPlanningTimeMillis: 0.095,
  explainCommandExecTimeMillis: 42.703,
  dataSize: '4087 kB',
  queryPlanner: {
    namespace: 'CarData.sampleColl',
    winningPlan: {
      stage: 'FETCH',
      estimatedTotalKeysExamined: 4350,
      inputStage: {
        stage: 'IXSCAN',
        indexName: 'car_info.registration.registration_datetime_1',
        isBitmap: true,
        indexFilterSet: [
          {
            '$range': {
              'car_info.registration.registration_datetime': {
                min: ISODate("2024-05-01T00:00:00.000Z"),
                max: ISODate("2024-05-07T00:00:00.000Z"),
                minInclusive: true,
                maxInclusive: false
              }
            }
          }
        ],
        estimatedTotalKeysExamined: 2
      }
    }
  },
  ok: 1
}
```

### Indexing the arrays at root

The example utilizes index on root array to identify for pokemon with weakness across `Ground, Water & Fire`.

```json
{
  _id: ObjectId("58f56170ee9d4bd5e610d644"),
  id: 1,
  num: '001',
  name: 'Bulbasaur',
  img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
  type: [ 'Grass', 'Poison' ],
  height: '0.71 m',
  weight: '6.9 kg',
  candy: 'Bulbasaur Candy',
  candy_count: 25,
  egg: '2 km',
  spawn_chance: 0.69,
  avg_spawns: 69,
  spawn_time: '20:00',
  multipliers: [ 1.58 ],
  weaknesses: [ 'Fire', 'Ice', 'Flying', 'Psychic' ],
  next_evolution: [ { num: '002', name: 'Ivysaur' }, { num: '003', name: 'Venusaur' } ]
}
```

```javascript
[mongos] Cosmicworks> db.sampleColl.createIndex({"weaknesses":1})

[mongos] Cosmicworks> db.Pokemon.countDocuments()
151
[mongos] Cosmicworks> db.Pokemon.find({"weaknesses":{$all:["Ground","Water","Fire"]}}).count()
2
[mongos] Cosmicworks> db.Pokemon.find({"weaknesses":{$all:["Ground","Water","Fire"]}}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'Pokemon', 'filter' : { 'weaknesses' : { '$all' : ['Ground', 'Water', 'Fire'] } } }})",
  explainCommandPlanningTimeMillis: 0.099,
  explainCommandExecTimeMillis: 1.188,
  dataSize: '906 bytes',
  queryPlanner: {
    namespace: 'Cosmicworks.Pokemon',
    winningPlan: {
      stage: 'COLLSCAN', // Thing to review
      runtimeFilterSet: [
        { '$all': { weaknesses: [ 'Ground', 'Water', 'Fire' ] } }
      ],
      estimatedTotalKeysExamined: 50
    }
  },
  ok: 1
}

[mongos] CarData> db.sampleColl.createIndex({"rental_history":1})
MongoServerError: Index key is too large. // Another error
```

### Indexing nested array

The example uses an index on nested array to identify for all the rentals, without a resolution provided to the customer.

```javascript
[mongos] CarData> db.sampleColl.createIndex({"rental_history.complains.resolutions":1})

[mongos] CarData> db.sampleColl.find({"rental_history.complains.resolutions":{ $exists: false, $ne: []}}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'sampleColl', 'filter' : { 'rental_history.complains.resolutions' : { '$exists' : false, '$ne' : [] } } }})",
  explainCommandPlanningTimeMillis: 0.12,
  explainCommandExecTimeMillis: 48.721000000000004,
  dataSize: '1747 kB',
  queryPlanner: {
    namespace: 'CarData.sampleColl',
    winningPlan: {
      stage: 'FETCH',
      estimatedTotalKeysExamined: 1933,
      inputStage: {
        stage: 'IXSCAN',
        indexName: 'rental_history.complains.resolutions_1',
        isBitmap: true,
        indexFilterSet: [
          {
            '$exists': { 'rental_history.complains.resolutions': false }
          },
          { '$ne': { 'rental_history.complains.resolutions': [] } }
        ],
        estimatedTotalKeysExamined: 2
      }
    }
  },
  ok: 1
}
```

### Indexing specific field in an array

The example utilizes the nested document property while evaluating the accidents between a time range.

```javascript
[mongos] CarData> db.sampleColl.createIndex({"rental_history.accidents.date":1})

[mongos] CarData> db.sampleColl.find({"rental_history.accidents.date":{ $gte : new ISODate("2024-05-01"),$lt: ISODate("2024-05-07")}}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'sampleColl', 'filter' : { 'rental_history.accidents.date' : { '$gte' : ISODate('2024-05-01T00:00:00Z'), '$lt' : ISODate('2024-05-07T00:00:00Z') } } }})",
  explainCommandPlanningTimeMillis: 19.816,
  explainCommandExecTimeMillis: 48.359,
  dataSize: '12 MB',
  queryPlanner: {
    namespace: 'CarData.sampleColl',
    winningPlan: {
      stage: 'FETCH',
      estimatedTotalKeysExamined: 4350,
      inputStage: {
        stage: 'IXSCAN',
        indexName: 'rental_history.accidents.date_1',
        isBitmap: true,
        indexFilterSet: [
          {
            '$range': {
              'rental_history.accidents.date': {
                min: ISODate("2024-05-01T00:00:00.000Z"),
                max: ISODate("2024-05-07T00:00:00.000Z"),
                minInclusive: true,
                maxInclusive: false
              }
            }
          }
        ],
        estimatedTotalKeysExamined: 2
      }
    }
  },
  ok: 1
}
```

### Wildcard indexing while excluding nested fields

```javascript
// Excludes all the nested sub-document property 
[mongos] CarData> db.sampleColl.createIndex({"$**":1},{"wildcardProjection":{"car_info.make":0,"car_info.model":0,"car_info.registration":0,"car_info.year":0,"rental_history":0}})

// Index created excludes model field from being indexed
[mongos] CarData> db.sampleColl.find({"car_info.model":"GT Fastback"}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'sampleColl', 'filter' : { 'car_info.model' : 'GT Fastback' } }})",
  explainCommandPlanningTimeMillis: 10.879,
  explainCommandExecTimeMillis: 374.25100000000003,
  dataSize: '0 bytes',
  queryPlanner: {
    namespace: 'CarData.sampleColl',
    winningPlan: {
      stage: 'COLLSCAN',
      runtimeFilterSet: [ { '$eq': { 'car_info.model': 'GT Fastback' } } ],
      estimatedTotalKeysExamined: 8700
    }
  },
  ok: 1
}
```

### Wildcard indexing while excluding nested objects

```javascript
// Wildcard index excluding nested object
[mongos] CarData> db.sampleColl.createIndex({"$**":1},{"wildcardProjection":{"car_info":0,"rental_history":0}})

// Querying internally on car_info and associated properties doesn't utilize index
[mongos] CarData> db.sampleColl.find({"car_info.make":"Mustang"}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'sampleColl', 'filter' : { 'car_info.make' : 'Mustang' } }})",
  explainCommandPlanningTimeMillis: 21.271,
  explainCommandExecTimeMillis: 337.475,
  dataSize: '0 bytes',
  queryPlanner: {
    namespace: 'CarData.sampleColl',
    winningPlan: {
      stage: 'COLLSCAN',
      runtimeFilterSet: [ { '$eq': { 'car_info.make': 'Mustang' } } ],
      estimatedTotalKeysExamined: 8700
    }
  },
  ok: 1
}
```

### Wildcard indexing while excluding fields with nested array

The wildcard index example allows excluding fields from nested array. We will use `pokemon` collection with json format highlighted.

```json
{
  _id: ObjectId("58f56170ee9d4bd5e610d644"),
  id: 1,
  num: '001',
  name: 'Bulbasaur',
  img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
  type: [ 'Grass', 'Poison' ],
  height: '0.71 m',
  weight: '6.9 kg',
  candy: 'Bulbasaur Candy',
  candy_count: 25,
  egg: '2 km',
  spawn_chance: 0.69,
  avg_spawns: 69,
  spawn_time: '20:00',
  multipliers: [ 1.58 ],
  weaknesses: [ 'Fire', 'Ice', 'Flying', 'Psychic' ],
  next_evolution: [ { num: '002', name: 'Ivysaur' }, { num: '003', name: 'Venusaur' } ]
}
```

We have excluded `name` property from within `next_evolution` array.

```javascript
[mongos] Cosmicworks> db.Pokemon.createIndex({"$**":1},{"wildcardProjection":{"id":0,"name":0,"multipliers":0,"next_evolution.num":0,"next_evolution.name":0}})

[mongos] Cosmicworks> db.Pokemon.find({"next_evolution.name":"Venusaur"}).explain()
{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'Pokemon', 'filter' : { 'next_evolution.name' : 'Venusaur' } }})",
  explainCommandPlanningTimeMillis: 0.799,
  explainCommandExecTimeMillis: 0.869,
  dataSize: '1090 bytes',
  queryPlanner: {
    namespace: 'Cosmicworks.Pokemon',
    winningPlan: {
      stage: 'COLLSCAN',
      runtimeFilterSet: [ { '$eq': { 'next_evolution.name': 'Venusaur' } } ],
      estimatedTotalKeysExamined: 76
    }
  },
  ok: 1
}
```

```javascript
// Can't use on json sample shared initially
[mongos] CarData> db.sampleColl.createIndex({"$**":1},{"wildcardProjection":{"car_info":0,"rental_history.pickup_location":0,"rental_history.drop_location":0,"rental_history.total_price":0,"rental_history.daily_rent":0,"rental_history.accidents":0,"rental_history.complains.complain_id":0,"rental_history.complains.issue":0,"rental_history.complains.resolutions.resolution_datetime":0,"rental_history.complains.resolutions.solution":0,"rental_history.complains.resolutions.resolved":0,"rental_history.complains.reported_datetime":0,"rental_history.complains.reported_medium":0,"rental_history.start_date":0,"rental_history.end_date":0,"rental_history.rental_id":0}})
MongoServerError: Index key is too large.
```

## Next steps

- Learn about indexing [Best practices](how-to-create-indexes.md) for most efficient outcomes.
- Learn about [background indexing](background-indexing.md)
- Learn here to work with [Text indexing](how-to-create-text-index.md).
- Learn here about [Wildcard indexing](how-to-create-wildcard-indexes.md).
