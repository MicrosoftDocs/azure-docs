---
title: Understanding the Azure Location Based Services Search service | Microsoft Docs 
description: Understanding the APIs available from the Azure Locaiton Based Services Search service.
services: location-based-services 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: philmea
ms.author: philmea
ms.date: 11/16/2017
ms.topic: concept
ms.service: location-based-services
manager: timlt
---

# Understanding the Azure Location Based Services Search service

The Search service is a RESTful API designed for developers to search for addresses, places, points of interest, business listings and other geographic information. Search Service assigns a latitude/longitude to a specific address; cross street; geographic feature or point of interest (POI).

Common use cases:
* Search for an address, a POI, or a combination of both
* Search for area, for example, "Seattle"
* Search for cross streets, for example "Clay Street Drumm street"
* Search for a POI near a POI or address, for example: "Restaurants on Main Street", "ATMs near AMC Theater", or "Parking near 1234 Main Street"

Key features include:

- Fuzzy search, with optional typeahead and fuzziness level setting
- Freetext and structured geocoding
- POI and POI category search

### Search Service API Descriptions
The Azure Location Based Services Search Service contains the following APIs:

#### Fuzzy Search
Single-line search for both addresses and POIs. Misspelling tolerance can be influenced by changing the fuzziness level.

#### POI Search
Search for POIs only.

#### POI Category Search
Search by category only and get POIs within the category.

#### Address Search
Get addresses as results only (no POIs).

#### Address Structured Search
Get addresses in a structured format as results only (no POIs).

#### Reverse Address Search
Translates coordinates into human readable addresses.

#### Reverse Address Cross Street Search
Translates coordinates into human readable addresses and cross streets.

## Fuzzy Search

The default API for the Search service is Fuzzy Search, which handles inputs of any combination of address or POI tokens. This search API is the canonical 'single-line search'. The Fuzzy Search API is a combination of POI search and geocoding. The API can also be weighted with a contextual position (lat./lon. pair), fully constrained by a coordinate and radius, or it can be executed more generally without any geo biasing anchor point.

You should use the **countrySet** parameter to specify only the countries for which your application needs coverage, as the default behavior will be to search the entire world, potentially returning unnecessary results.

#### Example: 
```
countrySet=US,MX
```

A list of all the countries supported by the Azure Search Service can be found in the [FAQ](#Frequently-Asked-Questions).

Most Search queries default to 'maxFuzzyLevel=1' to gain performance and reduce unusual results. This default can be overridden as needed per request by passing in the query parameter 'maxFuzzyLevel=2' or '3'.

The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchfuzzy)

### Request
The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchfuzzy)

```
GET https://atlas.azure-api.net/search/fuzzy/{format}?{api-version}{&query}[&typeahead=<typeahead>][&limit=<limit>][&ofs=<ofs>][&countrySet=<countrySet>][&lat=<lat>][&lon=<lon>][&radius=<radius>][&topLeft=<topLeft>][&btmRight=<btmRight>][&language=<language>][&extendedPostalCodesFor=<extendedPostalCodesFor>][&minFuzzyLevel=<minFuzzyLevel>][&maxFuzzyLevel=<maxFuzzyLevel>][&idxSet=<idxSet>]
```

#### Example: 
```
https://atlas.azure-api.net/search/fuzzy/json?api-version=1&query=seattle%20library&radius=1500
```

List of possible entity types:
* County
* CountrySubdivision
* CountrySecondarySubdivision
* CountryTeritarySubdivision
* Municipality
* MunicipalitySubdivision
* Neighborhood

List of available category codes can be found in the [FAQ](#Frequently-Asked-Questions).

## POI Search
If your search use case only requires POI results, you may use the POI endpoint for searching. This endpoint returns POI results. 

### Request
The full API reference for the POI Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchpoi)

```
GET https://atlas.azure-api.net/search/poi/{format}?{api-version}{&query}[&typeahead=<typeahead>][&limit=<limit>][&ofs=<ofs>][&countrySet=<countrySet>][&lat=<lat>][&lon=<lon>][&radius=<radius>][&topLeft=<topLeft>][&btmRight=<btmRight>][&language=<language>][&extendedPostalCodesFor=<extendedPostalCodesFor>]
```

#### Example:
```
https://atlas.azure-api.net/search/poi/json?api-version=1&query=library&lat=40.826000&lon=-73.923090
```

List of available category codes can be found in the [FAQ](#Frequently-Asked-Questions).

## POI Category Search
If your search use case only requires POI results filtered by category, you may use the category endpoint. This endpoint returns POI results, which are categorized as specified.

List of available categories can be found in the [FAQ](#Frequently-Asked-Questions). 

### Request
The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchpoicategoryy)

```
GET https://atlas.azure-api.net/search/poi/category/{format}?{api-version}{&query}[&typeahead=<typeahead>][&limit=<limit>][&ofs=<ofs>][&lat=<lat>][&lon=<lon>][&countrySet=<countrySet>][&radius=<radius>][&topLeft=<topLeft>][&btmRight=<btmRight>][&language=<language>][&extendedPostalCodesFor=<extendedPostalCodesFor>]
```

#### Example:
```
https://atlas.azure-api.net/search/poi/category/json?api-version=1&query=electric%20vehicle%20station&countrySet=SWE
```

List of available category codes can be found in the [FAQ](#Frequently-Asked-Questions). 

## Address Search
In many cases, the complete search service might be too much, for instance if you are only interested in traditional geocoding. Search can also be accessed for address lookup exclusively. The geocoding is performed by hitting the geocode endpoint with just the address or partial address in question. The geocoding search index is queried for everything above the street level data. No POIs is returned. The geocoder is tolerant of typos and incomplete addresses. It handles everything from exact street addresses, street or intersections, as well as higher-level geographies such as city centers, counties, and states.

### Request
The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchaddress)

```
GET https://atlas.azure-api.net/search/address/{format}?{api-version}{query}[&storeResult=<storeResult>][&typeahead=<typeahead>][&limit=<limit>][&ofs=<ofs>][&lat=<lat>][&lon=<lon>][&countrySet=<countrySet>][&radius=<radius>][&topLeft=<topLeft>][&btmRight=<btmRight>][&language=<language>][&extendedPostalCodesFor=<extendedPostalCodesFor>]
```

#### Example:
```
https://atlas.azure-api.net/search/address/json?api-version=1&query=1%20microsoft%20way%2C%20redmond%2C%20wa
```

## Address Structured Search
Azure Search can also be accessed for structured address lookup exclusively. The geocoding search index is queried for everything above the street level data. No POIs is returned. The geocoder is tolerant of typos and incomplete addresses. It handles everything from exact street addresses or street or intersections as well as higher-level geographies such as city centers, counties, states etc.


### Request
The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchaddressstructured)

```
GET https://atlas.azure-api.net/search/address/structured/{format}?{countryCode}{&api-version}[&limit=<limit>][&ofss=<ofss>][&streetNumber=<streetNumber>][&streetName=<streetName>][&crossStreet=<crossStreet>][&municipality=<municipality>][&municipalitySubdivision=<municipalitySubdivision>][&countryTertiarySubdivision=<countryTertiarySubdivision>][&countrySecondarySubdivision=<countrySecondarySubdivision>][&countrySubdivision=<countrySubdivision>][&postalCode=<postalCode>][&language=<language>][&extendedPostalCodesFor=<extendedPostalCodesFor>]
```

#### Example
```
https://atlas.azure-api.net/search/address/structured/json?api-version=1&countryCode=US&streetNumber=1&streetName=microsoft%20way&municipality=redmond&countrySubdivision=WA
```

## Reverse Address Search
There may be times when you need to translate a coordinate (example: 37.786505, -122.3862) into a human understandable street address. Most often this is needed in tracking applications where you receive a GPS feed from the device or asset and wish to know what address where the coordinate is located. This endpoint returns address information for a given coordinate.


### Request
The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchaddressreverse)

```
GET https://atlas.azure-api.net/search/address/reverse/{format}?{api-version}{&query}[&radius=<radius>][&language=<language>][&heading=<heading>][&number=<number>][&returnSpeedLimit=<returnSpeedLimit>][&returnRoadUse=<returnRoadUse>][&tolerance=<tolerance>][&returnMatchType=<returnMatchType>][&addressAttributes=<addressAttributes>][&spatialKeys=<spatialKeys>]
```
#### Example
```
https://atlas.azure-api.net/search/address/reverse/json?&api-version=1&query=47.640049,-122.129797
```

## Reverse Address Cross Street Search
There may be times when you need to translate a coordinate (example: 37.786505, -122.3862) into a human understandable cross street. Most often this is needed in tracking applications where you receive a GPS feed from the device or asset and wish to know what address where the coordinate is located.
This endpoint returns cross street information for a given coordinate.

### Request
The full API reference for the Fuzzy Search API can be found [here](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchaddressreversecrossstreet)

```
GET https://atlas.azure-api.net/search/address/reverse/crossStreet/{format}?{api-version}{&query}[&limit=<limit>][&spatialKeys=<spatialKeys>][&heading=<heading>][&radius=<radius>][&language=<language>]
```

#### Example:
```
https://atlas.azure-api.net/search/address/reverse/crossStreet/json?api-version=1&query=37.337,-121.89
```

## Frequently Asked Questions

### Does the Search Service return US Census information? 

Unfortunately, the Search Service does not return US Census information.

### What kinds of things can I enter as queries? 

You can enter any geographic information, such as the name or kind of a business, an address, or the name of a point of interest.

### What kinds of categories can I use? 

Category codes are generated for top-level categories. All sub categories share same category code. Note that this category list is subject to change with new data releases.

The following is a list of the category codes for supported category names:


| Category Code | Categories Matching Code |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ACCESS_GATEWAY | airline access | security gate | station access | access gateway |
| ADMINISTRATIVE_DIVISION | province | fourth-order administrative division | first-order administrative division | historical third-order administrative division | seat of a fourth-order administrative division | seat of a second-order administrative division | dependent political entity | populated place | seat of a third-order administrative division | populated places | second-order administrative division | seat of a first-order administrative division | administrative division | populated locality | historical region | historical site | historical populated place | israeli settlement | historical fourth-order administrative division | fifth-order administrative division | historical first-order administrative division | third-order administrative division | historical political entity | historical administrative division | seat of government of a political entity | historical second-order administrative division | capital of a political entity |
| ADVENTURE_SPORTS_VENUE | adventure sports venue |
| AGRICULTURE | horticulture | primary producer | agriculture | farm | farm village | farmstead | homestead | grazing area | common | aquaculture facility | farms | fishing area | dairy | field(s) |
| AIRPORT | private authority | military authority | heliport | closed | medium_airport | large_airport | small_airport | airfield | seaplane_base | public authority | balloonport | airport |
| AMUSEMENT_PARK | amusement arcade | amusement place | amusement park |
| AUTOMOTIVE_DEALER | atv/snowmobile | boat | bus | motorcycle | truck | van | recreational vehicles | car | automotive dealer |
| BANK | bank | banks | bank(s) |
| BEACH | beach | beaches |
| BUILDING_POINT | building (point) |
| BUSINESS_PARK | business park | industrial area |
| CAFE_PUB | internet café | tea house | cafe | internet cafe | café | coffee shop | microbrewery/beer garden | pub | café/pub | cafe/pub |
| CAMPING_GROUND | recreational | caravan site | camping ground |
| CAR_WASH | car wash |
| CASH_DISPENSER | automatic teller machine | cash dispenser |
| CASINO | casino |
| CINEMA | drive-in cinema | cinema |
| CITY_CENTER | neighborhood | administrative area | city center | center |
| CLUB_ASSOCIATION | beach club | hockey club | club association |
| COLLEGE_UNIVERSITY | junior college/community college | college/university | college | university prep school | university |
| COMMERCIAL_BUILDING | office building | park headquarters | commercial building |
| COMMUNITY_CENTER | community center |
| COMPANY | electronics | manufacturing | computer data services | public health technologies | diversified financials | animal shelter | airline | equipment rental | service | mail/package/freight delivery | bus lines | home appliance repair | cleaning services | oem | tax services | oil natural gas | legal services | construction | telecommunications | transport | automobile manufacturing | chemicals | funeral service mortuaries | bridge tunnel operations | automobile | mechanical engineering | services | investment advisors | advertising/marketing | moving storage | savings institution | insurance | computer software | pharmaceuticals | catering | wedding services | agricultural technology | real estate | taxi, limousine shuttle service | bus charter rentals | mining | publishing technologies | cable telephone | import/export distribution | company | asylum | coal mine(s) | estate(s) | brewery | gold mine(s) |
| COURTHOUSE | courthouse |
| CULTURAL_CENTER | cultural center |
| DENTIST | dentist |
| DEPARTMENT_STORE | department store |
| DOCTOR | general practitioner | specialist | doctor |
| ELECTRIC_VEHICLE_STATION | electric vehicle station |
| EMBASSY | embassy |
| EMERGENCY_MEDICAL_SERVICE | emergency medical service |
| ENTERTAINMENT | entertainment |
| EXCHANGE | gold exchange | currency exchange | stock exchange | exchange |
| EXHIBITION_CONVENTION_CENTER | exhibition convention center |
| FERRY_TERMINAL | ferry | ferry terminal |
| FIRE_STATION_BRIGADE | fire station/brigade |
| FRONTIER_CROSSING | frontier crossing |
| FUEL_FACILITIES | fuel facilities |
| GEOGRAPHIC_FEATURE | bay | cove | pan | locale | ridge | mineral/hot springs | well | reservoir | marsh/swamp/vlei | quarry | river crossing | valley | mountain peak | reef | dune | lagoon | plain/flat | rapids | cape | plateau | oasis | harbor | cave | rocks | geographic feature | promontory(-ies) | islands | headland | pier | crater lake | cliff(s) | hill | desert | portage | glacier(s) | gully | geyser | coral reef(s) | gap | gulf | jetty | ghat | hole | crater lakes | gasfield | islet | crater(s) | cove(s) | grassland | gravel area | fracture zone | heath | gorge(s) | island | headwaters | hanging valley | hills | hot spring(s) | furrow | anabranch |
| GOLF_COURSE | golf course |
| GOVERNMENT_OFFICE | order 5 area | order 8 area | order 9 area | order 2 area | order 7 area | order 3 area | supra national | order 4 area | order 6 area | government office | diplomatic facility | united states government establishment | local government office | customs house | customs post |
| HEALTH_CARE_SERVICE | blood bank | personal service | personal care facility | ambulance unit | health care service | leprosarium | sanatorium | hospital | medical center | clinic |
| HELIPAD_HELICOPTER_LANDING | helipad/helicopter landing |
| HOLIDAY_RENTAL | bungalow | cottage | chalet | villa | apartment | holiday rental |
| HOSPITAL_POLYCLINIC | special | hospital of chinese medicine | hospital for women children | general | hospital/polyclinic |
| HOTEL_MOTEL | cabins lodges | bed breakfast guest houses | hotel | rest camps | motel | resort | hostel | hotel/motel | resthouse | hammock(s) | guest house |
| ICE_SKATING_RINK | ice skating rink |
| IMPORTANT_TOURIST_ATTRACTION | building | observatory | arch | tunnel | statue | tower | bridge | planetarium | mausoleum/grave | monument | water hole | natural attraction | important tourist attraction | promenade | pyramids | pagoda | castle | palace | hermitage | pyramid | fort | gate | country house | dam | lighthouse | grave |
| INDUSTRIAL_BUILDING | foundry | fuel depot | industrial building | factory |
| LEISURE_CENTER | bowling | snooker, pool billiard | flying club | dance studio school | sauna, solarium massage | leisure center | spa |
| LIBRARY | library |
| MANUFACTURING_FACILITY | manufacturing facility |
| MARINA | yacht basin | marina |
| MARKET | supermarkets hypermarkets | farmers | public | informal | market |
| MEDIA_FACILITY | media facility |
| MILITARY_INSTALLATION | military base | coast guard station | military installation | naval base |
| MOTORING_ORGANIZATION_OFFICE | motoring organization office |
| MOUNTAIN_PASS | mountain pass |
| MUSEUM | museum |
| NATIVE_RESERVATION | native reservation | reservation |
| NIGHTLIFE | bar | karaoke club | jazz club | private club | wine bar | comedy club | cocktail bar | discotheque | nightlife |
| NON_GOVERNMENTAL_ORGANIZATION | non-governmental organization |
| OPEN_PARKING_AREA | open parking area | parking lot |
| OTHER | locality | free trade zone | traffic circle | unknown |
| PARKING_GARAGE | parking garage |
| PARK_RECREATION_AREA | historic site | lakeshore | seashore | river scenic area | fishing hunting area | battlefield | winter sport | boat launching ramp | preserve | forest area | recreation area | ski resort | cemetery | historical park | parkway | memorial | fairground | picnic area | wilderness area | park recreation area | forest(s) | fossilized forest | garden(s) | wildlife reserve | nature reserve | forest station | hunting reserve | forest reserve | park |
| PETROL_STATION | petrol station |
| PHARMACY | pharmacy | dispensary |
| PLACE_OF_WORSHIP | ashram | synagogue | mosque | gurudwara | church | temple | place of worship | mission | retreat | temple(s) | religious site | religious center | monastery | convent |
| POLICE_STATION | order 1 area | police station | police post |
| PORT_WAREHOUSE_FACILITY | harbor(s) | docking basin | port | port/warehouse facility | dockyard | dock(s) |
| POST_OFFICE | local | post office |
| PRIMARY_RESOURCE_UTILITY | primary resource/utility | power station | gas-oil separator plant |
| PRISON_CORRECTIONAL_FACILITY | prison | prison/correctional facility |
| PUBLIC_AMENITY | pedestrian subway | toilet | road rescue | passenger transport ticket office | public call box | public amenity | communication center |
| PUBLIC_TRANSPORT_STOP | coach stop | bus stop | taxi stand | tram stop | public transport stop | metro station | railroad station | bus station | railroad stop |
| RAILWAY_STATION | national | railway siding | metro | (sub) urban | railway station |
| RENT_A_CAR_FACILITY | rent-a-car facility |
| RENT_A_CAR_PARKING | rent-a-car-parking |
| REPAIR_FACILITY | bodyshops | tyre (tire) services | repair shops | car glass replacement shops | general car repair servicing | sale installation of car accessories | motorcycle repair | truck repair service | repair facility |
| RESEARCH_FACILITY | research facility |
| RESIDENTIAL_ACCOMMODATION | retirement community | townhouse complex | flats/apartment complex | condominium complex | residential estate | residential accommodation |
| RESTAURANT | german | creole-cajun | dutch | banquet rooms | bistro | israeli | slovak | jamaican | vegetarian | seafood | vietnamese | maltese | sichuan | welsh | chinese | japanese | algerian | californian | fusion | shandong | salad bar | savoyan | spanish | ethiopian | taiwanese | doughnuts | iranian | canadian | american | norwegian | french | hunan | polynesian | afghan | roadside | oriental | swiss | erotic | crêperie | surinamese | egyptian | hungarian | nepalese | barbecue | hot pot | hamburgers | mediterranean | latin american | tapas | british | mexican | guangdong | asian (other) | buffet | sushi | mongolian | international | mussels | thai | venezuelan | rumanian | chicken | soup | kosher | steak house | yogurt/juice bar | italian | korean | cypriot | bosnian | bolivian | dominican | belgian | tunisian | scottish | english | pakistani | czech | hawaiian | maghrib | tibetan | arabian | middle eastern | chilean | shanghai | polish | filipino | sudanese | armenian | burmese | brazilian | scandinavian | bulgarian | soul food | colombian | jewish | pizza | sicilian | organic | greek | basque | uruguayan | cafeterias | finnish | african | corsican | syrian | caribbean | dongbei | russian | grill | take away | fast food | australian | irish | pub food | fondue | lebanese | indonesian | danish | provençal | teppanyakki | indian | mauritian | western continental | peruvian | cambodian | snacks | swedish | macrobiotic | ice cream parlor | slavic | turkish | argentinean | austrian | exotic | portuguese | luxembourgian | moroccan | sandwich | cuban | restaurant |
| RESTAURANT_AREA | restaurant area |
| REST_AREA | rest area | halting place |
| SCENIC_PANORAMIC_VIEW | scenic/panoramic view | observation point |
| SCHOOL | culinary school | primary school | art school | senior high school | driving school | language school | sport school | pre school | high school | middle school | vocational training | special school | child care facility | school | technical school | military school | agricultural school |
| SHOP | factory outlet | security products | christmas/holiday store | opticians | house garden: lighting | lottery shop | musical instruments | nail salon | house garden: painting decorating | hobby/free time | newsagents tobacconists | clothing accessories: specialty | dry cleaners | bags leatherwear | pet supplies | clothing accessories: children | construction material equipment | jewelry, clocks watches | clothing accessories: footwear shoe repairs | house garden: curtains/textiles | electrical, office it: consumer electronics | electrical, office it: camera's photography | cd's, dvd videos | laundry | clothing accessories: men | florists | pawn shop | book shops | marine electronic equipment | food drinks: food markets | house garden: carpet/floor coverings | photocopy | boating equipment accessories | mobile phone shop | toys games | specialty foods | clothing accessories: general | food drinks: bakers | tailor shop | gifts, cards, novelties souvenirs | animal services | sports equipment clothing | stamp shop | electrical appliance | electrical, office it: office equipment | photo lab/development | wholesale clubs | house garden: furniture fittings | local specialities | food drinks: butchers | variety store | food drinks: food shops | food drinks: wine spirits | drug store | furniture/home furnishings | electrical, office it: computer computer supplies | cd/video rental | medical supplies equipment | agricultural supplies | beauty salon | house garden: garden centers services | food drinks: fishmongers | beauty supplies | clothing accessories: women | travel agents | retail outlet | recycling shop | house garden: glass windows | hardware | real estate agents | glassware/ceramic | delicatessen | house garden: kitchens bathrooms | betting station | hairdressers barbers | food drinks: grocers | food drinks: green grocers | convenience stores | drive through bottle shop | house garden: do-it-yourself centers | antique/art | shop | store |
| SHOPPING_CENTER | mall | shopping center |
| SPORTS_CENTER | thematic sport | squash court | fitness club center | sports center |
| STADIUM | netball | football | baseball | race track | multi-purpose | motor sport | cricket ground | rugby ground | ice hockey | athletic | horse racing | basketball | soccer | stadium | athletic field | racetrack |
| SWIMMING_POOL | swimming pool |
| TENNIS_COURT | tennis court |
| THEATER | amphitheater | concert hall | dinner theater | music center | opera | cabaret | theater | opera house |
| TOURIST_INFORMATION_OFFICE | tourist information office |
| TRAFFIC_LIGHT | traffic light |
| TRAFFIC_SERVICE_CENTER | traffic control department | traffic service center |
| TRAFFIC_SIGN | traffic sign |
| TRAIL_SYSTEM | adventure vehicle | rock climbing | horse riding | mountain bike | hiking | trail system |
| TRANSPORT_AUTHORITY_ | transport authority/vehicle registration |
| VEHICLE_REGISTRATION |  |
| TRUCK_STOP | truck stop |
| VETERINARIAN | veterinary facility | veterinarian |
| WATER_SPORT | water sport |
| WEIGH_STATION | weigh scales | weigh station |
| WELFARE_ORGANIZATION | welfare organization |
| WINERY | winery |
| ZOOS_ARBORETA_BOTANICAL_GARDEN | wildlife park | aquatic zoo marine park | arboreta botanical gardens | zoo | zoos, arboreta botanical garden |

### What languages are supported? 

The following IETF language tags are supported language parameter values:

| Language Name            | Language Tag |
|--------------------------|--------------|
| Afrikaans (South Africa) | af-ZA        |
| Arabic                   | ar           |
| Bulgarian                | bg-BG        |
| Chinese (Taiwan)         | zh-TW        |
| Czech                    | cs-CZ        |
| Danish                   | da-DK        |
| Dutch                    | nl-NL        |
| English (Great Britain)  | en-GB        |
| English (USA)            | en-US        |
| Finnish                  | fi-FI        |
| French                   | fr-FR        |
| German                   | de-DE        |
| Greek                    | el-GR        |
| Hungarian                | hu-HU        |
| Indonesian               | id-ID        |
| Italian                  | it-IT        |
| Korean                   | ko-KR        |
| Lithuanian               | lt-LT        |
| Malay                    | ms-MY        |
| Norwegian                | nb-NO        |
| Polish                   | pl-PL        |
| Portuguese (Brazil)      | pt-BR        |
| Portuguese (Portugal)    | pt-PT        |
| Russian                  | ru-RU        |
| Slovak                   | sk-SK        |
| Slovenian                | sl-SI        |
| Spanish (Castilian)      | es-ES        |
| Spanish (Mexico)         | es-MX        |
| Swedish                  | sv-SE        |
| Thai                     | th-TH        |
| Turkish                  | tr-TR        |


### What areas of the world are covered by the Search Service? 

The following geographical regions are covered:

| Region                  | Geography                        | Code | Address Points | House Number | Street Level | City Level |
|-------------------------|----------------------------------|------|----------------|--------------|--------------|------------|
| Americas                |                                  |      |                |              |              |            |
|                         | Antigua And Barbuda              | AG   |                |              | ●            | ●          |
|                         | Argentina                        | AR   |                | ●            | ●            | ●          |
|                         | Bahamas                          | BS   |                |              | ●            | ●          |
|                         | Barbados                         | BB   |                |              | ●            | ●          |
|                         | Bermuda                          | BM   |                |              | ●            | ●          |
|                         | Bolivia                          | BO   |                |              |              | ●          |
|                         | Bonaire, Sint Eustatius and Saba | BQ   |                |              | ●            | ●          |
|                         | Brazil                           | BR   | ●              | ●            | ●            | ●          |
|                         | Canada                           | CA   | ●              | ●            | ●            | ●          |
|                         | Cayman Islands                   | KY   |                |              | ●            | ●          |
|                         | Chile                            | CL   |                | ●            | ●            | ●          |
|                         | Colombia                         | CO   |                | ●            | ●            | ●          |
|                         | Costa Rica                       | CR   |                |              | ●            | ●          |
|                         | Cuba                             | CU   |                |              | ●            | ●          |
|                         | Ecuador                          | EC   |                |              |              | ●          |
|                         | El Salvador                      | SV   |                |              | ●            | ●          |
|                         | Falkland Islands                 | FK   |                |              |              | ●          |
|                         | French Guiana                    | GF   |                |              | ●            | ●          |
|                         | Grenada                          | GD   |                |              | ●            | ●          |
|                         | Guadaloupe                       | GP   |                | ●            | ●            | ●          |
|                         | Guatemala                        | GT   |                |              | ●            | ●          |
|                         | Guam                             | US   |                |              | ●            | ●          |
|                         | Guyana                           | GY   |                |              |              | ●          |
|                         | Haiti                            | HT   |                |              | ●            | ●          |
|                         | Honduras                         | HN   |                |              | ●            | ●          |
|                         | Jamaica                          | JM   |                |              | ●            | ●          |
|                         | Martinique                       | MQ   |                | ●            | ●            | ●          |
|                         | Mexico                           | MX   | ●              | ●            | ●            | ●          |
|                         | Netherlands Antilles             | AN   |                |              |              | ●          |
|                         | Nicaragua                        | NI   |                |              | ●            | ●          |
|                         | Panama                           | PA   |                |              | ●            | ●          |
|                         | Paraguay                         | PY   |                |              |              | ●          |
|                         | Peru                             | PE   |                |              | ●            | ●          |
|                         | Puerto Rico                      | PR   | ●              | ●            | ●            | ●          |
|                         | Saint Barthelemy                 | BL   |                |              | ●            | ●          |
|                         | Saint Kitts And Nevis            | KN   |                |              | ●            | ●          |
|                         | Saint Lucia                      | LC   |                |              | ●            | ●          |
|                         | Saint Martin                     | MF   |                |              | ●            | ●          |
|                         | Sint Maarten                     | SX   |                |              | ●            | ●          |
|                         | Suriname                         | SR   |                |              |              | ●          |
|                         | Trinidad And Tobago              | TT   |                |              | ●            | ●          |
|                         | United States                    | US   | ●              | ●            | ●            | ●          |
|                         | Uruguay                          | UY   |                |              | ●            | ●          |
|                         | Venezuela                        | VE   |                | ●            | ●            | ●          |
|                         | Virgin Islands - United States   | VG   | ●              | ●            | ●            | ●          |
| Asia Pacific            |                                  |      |                |              |              |            |
|                         | American Samoa                   | AS   |                |              |              |            |
|                         | Australia                        | AU   |                |              | ●            | ●          |
|                         | Bangladesh                       | BD   |                |              |              | ●          |
|                         | Brunei                           | BN   | ●              |              | ●            | ●          |
|                         | Cambodia                         | KH   |                |              |              | ●          |
|                         | Comorros                         | KM   |                |              |              | ●          |
|                         | Cook Islands                     | CK   |                |              |              | ●          |
|                         | French Polynesia                 | PF   |                |              |              | ●          |
|                         | Hong Kong                        | HK   | ●              | ●            | ●            | ●          |
|                         | India                            | IN   | ●              | ●            | ●            | ●          |
|                         | Indonesia                        | ID   | ●              | ●            | ●            | ●          |
|                         | Japan                            | JP   |                |              |              | ●          |
|                         | Kiribati                         | KI   |                |              |              | ●          |
|                         | Macao                            | MO   | ●              | ●            | ●            | ●          |
|                         | Malaysia                         | MY   | ●              | ●            | ●            | ●          |
|                         | Mongolia                         | MN   |                |              |              | ●          |
|                         | Nepal                            | NP   |                |              |              | ●          |
|                         | New Caledonia                    | NC   |                |              |              | ●          |
|                         | New Zealand                      | NZ   |                | ●            | ●            | ●          |
|                         | Norfolk Island                   | NF   |                |              |              | ●          |
|                         | Northern Mariana Islands         | MP   |                |              |              | ●          |
|                         | Pakistan                         | PK   |                |              |              | ●          |
|                         | Papua New Guinea                 | PG   |                |              |              | ●          |
|                         | Philippines                      | PH   | ●              | ●            | ●            | ●          |
|                         | Pitcairn                         | PN   |                |              |              | ●          |
|                         | Samoa                            | WS   |                |              |              | ●          |
|                         | Singapore                        | SG   | ●              | ●            | ●            | ●          |
|                         | South Korea                      | KR   |                |              |              | ●          |
|                         | Sri Lanka                        | LK   |                |              |              | ●          |
|                         | Taiwan                           | TW   | ●              | ●            | ●            | ●          |
|                         | Thailand                         | TH   | ●              | ●            | ●            | ●          |
|                         | Tonga                            | TO   |                |              |              | ●          |
|                         | Vietnam                          | VN   | ●              | ●            | ●            | ●          |
| Europe                  |                                  |      |                |              |              |            |
|                         | Albania                          | AL   |                |              | ●            | ●          |
|                         | Andorra                          | AD   | ●              | ●            | ●            | ●          |
|                         | Armenia                          | AM   |                |              |              | ●          |
|                         | Austria                          | AT   | ●              | ●            | ●            | ●          |
|                         | Azerbaijan                       | AZ   |                |              |              | ●          |
|                         | Azores and Madeira               |      |                | ●            | ●            | ●          |
|                         | Belgium                          | BE   | ●              | ●            | ●            | ●          |
|                         | Bosnia And Herzegovina           | BA   |                |              | ●            | ●          |
|                         | Bulgaria                         | BG   |                | ●            | ●            | ●          |
|                         | Croatia                          | HR   |                | ●            | ●            | ●          |
|                         | Cyprus                           | CY   |                | ●            | ●            | ●          |
|                         | Czech Republic                   | CZ   | ●              | ●            | ●            | ●          |
|                         | Denmark                          | DK   | ●              | ●            | ●            | ●          |
|                         | Estonia                          | EE   |                | ●            | ●            | ●          |
|                         | Finland                          | FI   |                | ●            | ●            | ●          |
|                         | France                           | FR   | ●              | ●            | ●            | ●          |
|                         | Georgia                          | GE   |                |              |              | ●          |
|                         | Germany                          | DE   | ●              | ●            | ●            | ●          |
|                         | Gibralter                        | GI   |                |              | ●            | ●          |
|                         | Greece                           | GR   |                | ●            | ●            | ●          |
|                         | Greenland                        | GL   |                |              |              | ●          |
|                         | Hungary                          | HU   |                |              | ●            | ●          |
|                         | Iceland                          | IS   |                | ●            | ●            | ●          |
|                         | Ireland (Republic of)            | IE   | ●              | ●            | ●            | ●          |
|                         | Italy                            | IT   | ●              | ●            | ●            | ●          |
|                         | Kazakhstan                       | KZ   |                |              |              | ●          |
|                         | Kosovo                           | XK   |                |              | ●            | ●          |
|                         | Kyrgyzstan                       | KG   |                |              |              | ●          |
|                         | Latvia                           | LV   |                | ●            | ●            | ●          |
|                         | Liechtenstein                    | LI   |                | ●            | ●            | ●          |
|                         | Lithuania                        | LT   |                | ●            | ●            | ●          |
|                         | Luxembourg                       | LU   | ●              | ●            | ●            | ●          |
|                         | Macedonia                        | MK   |                |              | ●            | ●          |
|                         | Malta                            | MT   |                |              | ●            | ●          |
|                         | Moldova                          | MD   |                |              | ●            | ●          |
|                         | Monaco                           | MC   |                | ●            | ●            | ●          |
|                         | Montenegro                       | ME   |                | ●            | ●            | ●          |
|                         | Netherlands                      | NL   | ●              | ●            | ●            | ●          |
|                         | Norway                           | NO   |                | ●            | ●            | ●          |
|                         | Poland                           | PL   | ●              | ●            | ●            | ●          |
|                         | Portugal                         | PT   | ●              | ●            | ●            | ●          |
|                         | Romania                          | RO   |                | ●            | ●            | ●          |
|                         | Russian Federation               | RU   | ●              | ●            | ●            | ●          |
|                         | San Marino                       | SM   |                | ●            | ●            | ●          |
|                         | Serbia                           | RS   |                | ●            | ●            | ●          |
|                         | Slovakia                         | SK   | ●              | ●            | ●            | ●          |
|                         | Slovenia                         | SI   |                | ●            | ●            | ●          |
|                         | Spain                            | ES   | ●              | ●            | ●            | ●          |
|                         | Sweden                           | SE   |                | ●            | ●            | ●          |
|                         | Switzerland                      | CH   | ●              | ●            | ●            | ●          |
|                         | Tajikistan                       | TJ   |                |              |              | ●          |
|                         | Turkey                           | TR   | ●              | ●            | ●            | ●          |
|                         | Turkmenistan                     | TM   |                |              |              | ●          |
|                         | Ukraine                          | UA   |                | ●            | ●            | ●          |
|                         | United Kingdom                   | GB   |                | ●            | ●            | ●          |
|                         | Vatican City                     | VA   |                | ●            | ●            | ●          |
| Middle East  and Africa |                                  |      |                |              |              |            |
|                         | Afghanistan                      | AF   |                |              |              | ●          |
|                         | Algeria                          | DZ   |                |              | ●            | ●          |
|                         | Angola                           | AO   |                |              | ●            | ●          |
|                         | Bahrain                          | BH   |                |              | ●            | ●          |
|                         | Benin                            | BJ   |                |              | ●            | ●          |
|                         | Botswana                         | BW   |                |              | ●            | ●          |
|                         | Burkina Faso                     | BF   |                |              | ●            | ●          |
|                         | Burundi                          | BI   |                |              | ●            | ●          |
|                         | Cameroon                         | CM   |                |              | ●            | ●          |
|                         | Cape Verde                       | CV   |                |              |              | ●          |
|                         | Central African Republic         | CF   |                |              |              | ●          |
|                         | Chad                             | TD   |                |              |              | ●          |
|                         | Congo                            | CG   |                |              | ●            | ●          |
|                         | Cote D'Ivoire                    | CI   |                |              |              | ●          |
|                         | Democratic Republic of Congo     | CD   |                |              | ●            | ●          |
|                         | Djibouti                         | DJ   |                |              |              | ●          |
|                         | Egypt                            | EG   |                | ●            | ●            | ●          |
|                         | Eritrea                          | ER   |                |              |              | ●          |
|                         | Ethiopia                         | ET   |                |              |              | ●          |
|                         | Gabon                            | GA   |                |              | ●            | ●          |
|                         | Gambia                           | GM   |                |              |              | ●          |
|                         | Ghana                            | GH   |                |              | ●            | ●          |
|                         | Guinea                           | GN   |                |              |              | ●          |
|                         | Guinea-Bissau                    | GW   |                |              |              | ●          |
|                         | Iran                             | IR   |                |              |              | ●          |
|                         | Iraq                             | IQ   |                |              | ●            | ●          |
|                         | Israel                           | IL   |                | ●            | ●            | ●          |
|                         | Jordan                           | JO   | ●              | ●            | ●            | ●          |
|                         | Kenya                            | KE   |                |              | ●            | ●          |
|                         | Kuwait                           | KW   | ●              | ●            | ●            | ●          |
|                         | Lebanon                          | LB   |                |              | ●            | ●          |
|                         | Lesotho                          | LS   |                |              | ●            | ●          |
|                         | Liberia                          | LR   |                |              |              | ●          |
|                         | Libyan Arab Jamahiriya           | LY   |                |              |              | ●          |
|                         | Madagascar                       | MG   |                |              |              | ●          |
|                         | Malawi                           | MW   |                |              | ●            | ●          |
|                         | Mali                             | ML   |                |              | ●            | ●          |
|                         | Mauritania                       | MR   |                |              | ●            | ●          |
|                         | Mauritius                        | MU   |                |              | ●            | ●          |
|                         | Mayotte                          | YT   |                |              | ●            | ●          |
|                         | Morocco                          | MA   |                |              | ●            | ●          |
|                         | Mozambique                       | MZ   |                |              | ●            | ●          |
|                         | Namibia                          | NA   |                | ●            | ●            | ●          |
|                         | Niger                            | NE   |                |              | ●            | ●          |
|                         | Nigeria                          | NG   |                |              | ●            | ●          |
|                         | Oman                             | OM   |                |              | ●            | ●          |
|                         | Palestinian Territories          | PS   |                |              |              | ●          |
|                         | Qatar                            | QA   |                |              | ●            | ●          |
|                         | Reunion                          | RE   |                | ●            | ●            | ●          |
|                         | Rwanda                           | RW   |                |              | ●            | ●          |
|                         | Saint Helena                     | SH   |                |              |              | ●          |
|                         | Saudi Arabia                     | SA   |                | ●            | ●            | ●          |
|                         | Senegal                          | SN   |                |              | ●            | ●          |
|                         | Seychelles                       | SC   |                |              |              | ●          |
|                         | Sierra Leone                     | SL   |                |              |              | ●          |
|                         | Somalia                          | SO   |                |              |              | ●          |
|                         | South Africa                     | ZA   | ●              | ●            | ●            | ●          |
|                         | South Sudan                      | SS   |                |              |              | ●          |
|                         | Sudan                            | SD   |                |              |              | ●          |
|                         | Swaziland                        | SZ   |                |              | ●            | ●          |
|                         | Syria                            | SY   |                |              |              | ●          |
|                         | Tanzania                         | TZ   |                |              | ●            | ●          |
|                         | Togo                             | TG   |                |              | ●            | ●          |
|                         | Tunisia                          | TN   |                |              | ●            | ●          |
|                         | Uganda                           | UG   |                |              | ●            | ●          |
|                         | Yemen                            | YE   |                |              | ●            | ●          |
|                         | Zambia                           | ZM   |                |              | ●            | ●          |