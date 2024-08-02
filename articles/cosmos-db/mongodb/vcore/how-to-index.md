---
"title":  Exploring indexing scenarios on Azure Cosmos DB for MongoDB vCore
"titleSuffix": Azure Cosmos DB for MongoDB vCore
"description": Practical indexing examples in Azure Cosmos DB for MongoDb vCore.
"author": avijitgupta
"ms.author": avijitgupta
"ms.reviewer": gahllevy
"ms.service": azure-cosmos-db
"ms.subservice": mongodb-vcore
"ms.topic": conceptual
"ms.date": 07/30/2024
---

# Scenario based guide to indexing in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Indexes are structures that enhance data retrieval speed by enabling quick access to specific fields within a collection. This article explains how to perform indexing at various nesting levels and reviews how to effectively review utilization of these indexes.

## Indexing scenarios

We would work on example scenarios with context to the defined sample json.

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

Azure Cosmos DB for MongoDB vCore allows indexes on root properties. The example allows searching `sampleColl` by `car_id`.

```javascript
CarData> db.sampleColl.createIndex({"car_id":1})
```

Execution plan allows reviewing the utilization of index created on `car_id` field with `explain`.

```javascript
CarData> db.sampleColl.find({"car_id":"ZA-XWB804"}).explain()

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

Azure Cosmos DB for MongoDB vCore allows indexing embedded document properties. The example creates an index  on field `registration_datetime` within a nested document `registration`.

```javascript
CarData> db.sampleColl.createIndex({"car_info.registration.registration_datetime":1})
```

Review execution plan with `explain` provides insight into index scan.

```javascript
CarData> db.sampleColl.find({"car_info.registration.registration_datetime":
                              {  $gte : new ISODate("2024-05-01")
                                ,$lt: ISODate("2024-05-07")
                              }
                            }).explain()


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

Azure Cosmos DB for MongoDB vCore allows indexing the root property defined as an array. Let us consider following json sample.

```json
{
  "_id": ObjectId("58f56170ee9d4bd5e610d644"),
  "id": 1,
  "num": 001,
  "name": "Bulbasaur",
  "img": "http://www.serebii.net/pokemongo/pokemon/001.png",
  "type": [ 'Grass', 'Poison' ],
  "height": '0.71 m',
  "weight": '6.9 kg',
  "avg_spawns": 69,
  "spawn_time": "20:00",
  "multipliers": [ 1.58 ],
  "weaknesses": [ "Fire", "Ice", "Flying", "Psychic"],
  "next_evolution": [ { "num": "002", "name": "Ivysaur" }, { "num": "003", "name": "Venusaur" }]
}
```

In our example, we create an index on `weaknesses` array field and we're reviewing for the existence of all three values `Ground`, `Water` & `Fire` in the array.

```javascript
Cosmicworks> db.Pokemon.createIndex({'weaknesses':1})

Cosmicworks> db.Pokemon.find({"weaknesses":
                                {$all:["Ground","Water","Fire"]}
                              }
                            ).explain()

{
  explainVersion: 2,
  command: "db.runCommand({explain: { 'find' : 'Pokemon', 'filter' : { 'weaknesses' : { '$all' : ['Ground', 'Water', 'Fire'] } } }})",
  explainCommandPlanningTimeMillis: 10.161,
  explainCommandExecTimeMillis: 21.64,
  dataSize: '906 bytes',
  queryPlanner: {
    namespace: 'Cosmicworks.Pokemon',
    winningPlan: {
      stage: 'FETCH',
      estimatedTotalKeysExamined: 50,
      inputStage: {
        stage: 'IXSCAN',
        indexName: 'weaknesses_1',
        isBitmap: true,
        indexFilterSet: [
          { '$all': { weaknesses: [ 'Ground', 'Water', 'Fire' ] } }
        ],
        estimatedTotalKeysExamined: 2
      }
    }
  },
  ok: 1
}
```

> [!NOTE]
> For MongoServerError: Index key is too large.
>
> Please create a support request for enabling background indexing, followed by `enableLargeIndexKeys`
>
> db.runCommand({ createIndexes: "collectionName", indexes: [{ {"index_spec"}], enableLargeIndexKeys: true });

### Indexing nested arrays

Azure Cosmos DB for MongoDB vCore allows indexing nested arrays. The example creates an index on `resolutions` field existing within `complains` array.

```javascript
CarData> db.sampleColl.createIndex({"rental_history.complains.resolutions":1})
```

We review the plan with `explain` to identify for all the rentals, without a resolution provided to the customer.

```javascript
CarData> db.sampleColl.find({"rental_history.complains.resolutions":{ $exists: false, $ne: []}}).explain()

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

Azure Cosmos DB for MongoDB vCore allows indexing fields within an array. The example creates an index on `date` field within `accidents` array.

```javascript
CarData> db.sampleColl.createIndex({"rental_history.accidents.date":1})
```

The example query evaluates for the accidents between a time range, shows index created on `date` property being utilized.

```javascript
CarData> db.sampleColl.find({"rental_history.accidents.date":
                                { $gte : ISODate("2024-05-01")
                                , $lt  : ISODate("2024-05-07")
                                }
                            }).explain()

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

> [!NOTE]
> We are currently enhancing support for nested arrays. In certain edge cases, specific indexing operations may lead to errors.

### Wildcard indexing while excluding nested fields

Azure Cosmos DB for MongoDB vCore supports Wildcard indexes. The example allows us to exclude indexing all nested fields within document `car_info`.

```javascript
// Excludes all the nested sub-document property 
CarData> db.sampleColl.createIndex(  {"$**":1}
                                    ,{"wildcardProjection":
                                          {  "car_info.make":0
                                            ,"car_info.model":0
                                            ,"car_info.registration":0
                                            ,"car_info.year":0
                                            ,"rental_history":0
                                          }
                                      }
                                  )
```

Execution plan does show no support for queries performed on `model` field, which was excluded while creating the Wildcard index.

```javascript
CarData> db.sampleColl.find({"car_info.model":"GT Fastback"}).explain()
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

Azure Cosmos DB for MongoDB vCore supports Wildcard indexes. The example allows us to exclude nested objects from the document.

```javascript
// Wildcard index excluding nested object
[mongos] CarData> db.sampleColl.createIndex( {"$**":1},
                                             {"wildcardProjection":
                                                    {  "car_info":0
                                                      ,"rental_history":0
                                                    }
                                              }
                                            )
```

Execution plan shows no support for queries performed on nested field `make` within `car_info` document.

```javascript
CarData> db.sampleColl.find({"car_info.make":"Mustang"}).explain()
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

The wildcard index example allows excluding fields from nested array. We use `pokemon` collection with json format highlighted.

```json
{
{
  "_id": ObjectId("58f56170ee9d4bd5e610d644"),
  "id": 1,
  "num": 001,
  "name": "Bulbasaur",
  "img": "http://www.serebii.net/pokemongo/pokemon/001.png",
  "type": [ 'Grass', 'Poison' ],
  "height": '0.71 m',
  "weight": '6.9 kg',
  "avg_spawns": 69,
  "spawn_time": "20:00",
  "multipliers": [ 1.58 ],
  "weaknesses": [ "Fire", "Ice", "Flying", "Psychic"],
  "next_evolution": [ { "num": "002", "name": "Ivysaur" }, { "num": "003", "name": "Venusaur" }]
}
}
```

We're creating index on all the fields within the json excluding a `num` and `name` fields from within an array.

```javascript
Cosmicworks> db.Pokemon.createIndex( {"$**":1},
                                     {"wildcardProjection":
                                        {  "id":0
                                          ,"name":0
                                          ,"multipliers":0
                                          ,"next_evolution.num":0
                                          ,"next_evolution.name":0
                                        }
                                      }
                                    )
```

Explain plan shows no index utilization while querying on `name` field within `next_evolution` array.

```javascript
Cosmicworks> db.Pokemon.find({"next_evolution.name":"Venusaur"}).explain()
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

## Next steps

- Learn here about [Wildcard indexing](how-to-create-wildcard-indexes.md).
- Learn about indexing [Best practices](how-to-create-indexes.md) for most efficient outcomes.
- Learn about [background indexing](background-indexing.md)
- Learn here to work with [Text indexing](how-to-create-text-index.md).
