---
title: Pre-built entities in LUIS | Microsoft Docs
description: This article contains lists of the pre-built entities that are included in Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/15/2017
ms.author: cahann
---

# Pre-built Entities

LUIS includes a set of pre-built entities. When a pre-built entity is included in your application, its predictions will be included in your published application and be available to you in the LUIS web UI while labeling utterances. The behavior of pre-built entities **cannot** be modified. Unless otherwise noted, pre-built entities are available in all LUIS application locales (cultures). Below is a table of pre-built entities supported per culture.

Pre-built entity   |   en-US   |   fr-FR   |   it-IT   |   es-ES   |   zh-CN   |   de-DE   |   pt-BR   |   ja-JP   |   ko-kr
------|------|------|------|------|------|------|------|------|------|
 Datetime   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Number   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Ordinal   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Percentage   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Temperature   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Dimension   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Money   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Age   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   :ballot_box_with_check:   |   -   |
Geography   |   :ballot_box_with_check:   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
Encyclopedia   |   :ballot_box_with_check:   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
URL   |   :ballot_box_with_check:   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
Email   |   :ballot_box_with_check:   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
Phone number   |   :ballot_box_with_check:   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |

#### Below is a table of pre-built entities with example utterances and their return values.

Pre-built entity   |   Example utterance   |   JSON
------|------|------|
 builtin.number     |   ten   |``` { "type": "builtin.number", "entity": "ten" } ```|
 builtin.number     |   3.1415   |```  { "type": "builtin.number", "entity": "3 . 1415" }``` |
 builtin.ordinal     |   first   |```{ "type": "builtin.ordinal", "entity": "first" }``` |
 builtin.ordinal     |   10th   | ```{ "type": "builtin.ordinal", "entity": "10th" }``` |  
 builtin.temperature     |   10 degrees celcius   | ```{ "type": "builtin.temperature", "entity": "10 degrees celcius" }```|   
 builtin.temperature     |   78 F   |```{ "type": "builtin.temperature", "entity": "78 f" }```|
 builtin.dimension     |   2 miles   |```{ "type": "builtin.dimension", "entity": "2 miles" }```|
 builtin.dimension     |  650 square kilometers   |```{ "type": "builtin.dimension", "entity": "650 square kilometers" }```|
 builtin.money     |   1000.00 US dollars   |```{ "type": "builtin.money", "entity": "1000.00 us dollars" }```
 builtin.money     |   $ 67.5 B   |```{ "type": "builtin.money", "entity": "$ 67.5" }```|
 builtin.age   |   100 year old   |```{ "type": "builtin.age", "entity": "100 year old" }```|  
 builtin.age   |   19 years old   |```{ "type": "builtin.age", "entity": "19 years old" }```|
 builtin.percentage   |   The stock price increase by 7 $ this year   |```{ "type": "builtin.percentage", "entity": "7 %" }```|
 builtin.datetime | See separate table | See separate table below |
 builtin.geography | See separate table | See separate table below |
 builtin.encyclopedia | See separate table | See separate table below |
 
 The last 3 built-in entity types listed in the table above encompass multiple subtypes. These are covered next.
 
### builtin.datetime

The builtin.datetime pre-built entity has awareness of the current date and time. In the examples below, the current date is 2015-08-14. Also, builtin.datetimeprovides a resolution field that produces a machine-readable dictionary. 

#### This pre-built entity has 3 subtypes:

Pre-built entity   |   Example utterance   |   JSON
------|------|------|
builtin.datetime.date      |   tomorrow   |```{ "type": "builtin.datetime.date", "entity": "tomorrow", "resolution": {"date": "2015-08-15"} }``` |
builtin.datetime.date      |   january 10 2009   |```{ "type": "builtin.datetime.date", "entity": "january 10 2009", "resolution": {"date": "2009-01-10"} }```|
builtin.datetime.date      |   monday    |```{ "entity": "monday", "type": "builtin.datetime.date", "resolution": {"date": "XXXX-WXX-1"} }```|
builtin.datetime.date      |   next week   |```{ "entity": "next week", "type": "builtin.datetime.date", "resolution": {"date":  "2015-W34"} }```|
builtin.datetime.date      |   next monday   |```{ "entity": "next monday", "type": "builtin.datetime.date", "resolution": {"date": "2015-08-17"} }```|
builtin.datetime.date      |   week of september 30th   |```{ "entity": "week of september 30th", "type": "builtin.datetime.date", "resolution": {"comment": "weekof", "date": "XXXX-09-30"} }```|
builtin.datetime.time      |   3 : 00   |```{ "type": "builtin.datetime.time", "entity": "3 : 00", "resolution": {"comment": "ampm", "time": "T03:00"}	}```|
builtin.datetime.time      |   4 pm     |```{ "type": "builtin.datetime.time", "entity": "4 pm", "resolution": {"time": "T16"}	}```|
builtin.datetime.time      |   tomorrow morning   |```{ "entity": "tomorrow morning", "type": "builtin.datetime.time", "resolution": {"time": "2015-08-15TMO"} }```|
builtin.datetime.time      |   tonight  |```{ "entity": "tonight", "type": "builtin.datetime.time", "resolution": {"time": "2015-08-14TNI"} }```|
builtin.datetime.duration      |    for 3 hours    |```{ "type": "builtin.datetime.duration", "entity": "3 hours", "resolution": {"duration": "PT3H"}	}```|
builtin.datetime.duration      |    30 minutes long   |```{ "type": "builtin.datetime.duration", "entity": "30 minutes", "resolution": {"duration": "PT30M"}	}```|    
builtin.datetime.duration      |    all day    |```{ "type": "builtin.datetime.duration", "entity": "all day", "resolution": {"duration": "P1D"}	}```|
builtin.datetime.set    |   daily   |```{ "type": "builtin.datetime.set", "entity": "daily", {"resolution": "time": "XXXX-XX-XX"}	}```|
builtin.datetime.set    |   every morning   |```{ "type": "builtin.datetime.set", "entity": "every morning", "resolution": {"time": "XXXX-XX-XXTMO"}	}```|
builtin.datetime.set    |   every tuesday   |```{ "entity": "every tuesday", "type": "builtin.datetime.set", "resolution":  {"time": "XXXX-WXX-2"} }```|   
builtin.datetime.set    |   every week   |```{ "entity": "every week", "type": "builtin.datetime.set", "resolution": {"time": "XXXX-WXX"} }```|

### builtin.geography

Note: builtin.geography is available only in en-us.

#### The builtin.geography built-in entity type has 3 sub-types:

Pre-built entity   |   Example utterance   |   JSON
------|------|------|
builtin.geography.city   |  seattle    |```{ "type": "builtin.geography.city", "entity": "seattle" }```|
builtin.geography.city   |  paris    |```{ "type": "builtin.geography.city", "entity": "paris" }```|
builtin.geography.country|  australia    |```{ "type": "builtin.geography.country", "entity": "australia" }```|
builtin.geography.country|  japan    |```{ "type": "builtin.geography.country", "entity": "japan" }```|
builtin.geography.pointOfInterest   |   amazon river |```{ "type": "builtin.geography.pointOfInterest", "entity": "amazon river" }```|
builtin.geography.pointOfInterest   |   sahara desert|```{ "type": "builtin.geography.pointOfInterest", "entity": "sahara desert" }```|

### builtin.encyclopedia

Note: builtin.encyclopedia is available only in en-US.

##### The builtin.encyclopedia built-in entity includes over 100 sub-types, listed below. In addition, encyclopedia entities often map to multiple types. For example, the query Ronald Reagan yields: 
```
{
      "entity": "ronald reagan",
      "type": "builtin.encyclopedia.people.person"
    },
    {
      "entity": "ronald reagan",
      "type": "builtin.encyclopedia.film.actor"
    },
    {
      "entity": "ronald reagan",
      "type": "builtin.encyclopedia.government.us_president"
    },
    {
      "entity": "ronald reagan",
      "type": "builtin.encyclopedia.book.author"
    }
 ```


Pre-built entity   |   Pre-built entity (sub-types)   |   Example utterance
------|------|------|
builtin.encyclopedia.people.person   |  builtin.encyclopedia.people.person  |   bryan adams |
builtin.encyclopedia.people.person   |  builtin.encyclopedia.film.producer  | walt disney |
builtin.encyclopedia.people.person   |  builtin.encyclopedia.film.cinematographer | adam greenberg   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.royalty.monarch  |  elizabeth ii   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.film.director  | steven spielberg   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.film.writer   |  alfred hitchcock   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.film.actor   |  robert de niro   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.martial_arts.martial_artist   |  bruce lee   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.architecture.architect   | james gallier   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.geography.mountaineer   |  jean couzy   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.celebrities.celebrity   |  angelina jolie   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.music.musician   |  bob dylan   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.soccer.player  |  diego maradona   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.baseball.player   |  babe ruth   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.basketball.player   |  heiko schaffartzik   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.olympics.athlete   |  andre agassi   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.basketball.coach   |  bob huggins   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.american_football.coach   |  james franklin   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.cricket.coach   |  andy flower   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.ice_hockey.coach   |  david quinn   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.ice_hockey.player   |  vincent lecavalier   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.government.politician   |  harold nicolson   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.government.us_president   |  barack obama   |   
builtin.encyclopedia.people.person   |  builtin.encyclopedia.government.us_vice_president   |  dick cheney   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.organization.organization   |  united nations   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.sports.league   |  american league   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.ice_hockey.conference   |  western hockey league   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.baseball.division   |  american league east   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.baseball.league   |  major league baseball   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.basketball.conference   |  national basketball league   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.basketball.division   |  pacific division   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.soccer.league   |  premier league   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.american_football.division   |  afc north   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.broadcast.broadcast | nebraska educational telecommunications|
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.broadcast.tv_station   |  abc   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.broadcast.tv_channel   |  cnbc world   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.broadcast.radio_station   |  bbc radio 1   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.business.operation   |  bank of china   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.music.record_label   |  pixar   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.aviation.airline   |  air france   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.automotive.company   |  general motors   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.music.musical_instrument_company | gibson guitar corporation |
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.tv.network   |  cartoon network   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.education.educational_institution   |  cornwall hill college |
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.education.school   |  boston arts academy   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.education.university   |  johns hopkins university   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.sports.team   |  united states national handball team   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.basketball.team   |  chicago bulls   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.sports.professional_sports_team   |  boston celtics   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.cricket.team   |  mumbai indians   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.baseball.team   |  houston astros   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.american_football.team   |  green bay packers   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.ice_hockey.team   |  hamilton bulldogs   |   
builtin.encyclopedia.organization.organization   |  builtin.encyclopedia.soccer.team   |  fc bayern munich   |   
builtin.encyclopedia.organization.organization |builtin.encyclopedia.government.political_party|pertubuhan kebangsaan melayu singapura|
builtin.encyclopedia.time.event   |  builtin.encyclopedia.time.event   |  1740 batavia massacre    |   
builtin.encyclopedia.time.event   |  builtin.encyclopedia.sports.championship_event   |  super bowl xxxix   |   
builtin.encyclopedia.time.event   |  builtin.encyclopedia.award.competition   |  eurovision song contest 2003   |   
builtin.encyclopedia.tv.series_episode   |  builtin.encyclopedia.tv.series_episode   |  the magnificent seven   |   
builtin.encyclopedia.tv.series_episode   |  builtin.encyclopedia.tv.multipart_tv_episode   |  the deadly assassin   |   
builtin.encyclopedia.commerce.consumer_product   |  builtin.encyclopedia.commerce.consumer_product   |  nokia lumia 620   |   
builtin.encyclopedia.commerce.consumer_product   |  builtin.encyclopedia.music.album   |  dance pool   |   
builtin.encyclopedia.commerce.consumer_product   |  builtin.encyclopedia.automotive.model   |  pontiac fiero   |   
builtin.encyclopedia.commerce.consumer_product   |  builtin.encyclopedia.computer.computer   | toshiba satellite   |   
builtin.encyclopedia.commerce.consumer_product   |  builtin.encyclopedia.computer.web_browser   |  internet explorer   |   
builtin.encyclopedia.commerce.brand   |  builtin.encyclopedia.commerce.brand   |  diet coke   |   
builtin.encyclopedia.commerce.brand   |  builtin.encyclopedia.automotive.make   |  chrysler   |   
builtin.encyclopedia.music.artist   |  builtin.encyclopedia.music.artist   |  michael jackson   |   
builtin.encyclopedia.music.artist   |  builtin.encyclopedia.music.group   |  the yardbirds   |   
builtin.encyclopedia.music.music_video   |  builtin.encyclopedia.music.music_video   |  the beatles anthology   |   
builtin.encyclopedia.theater.play   |  builtin.encyclopedia.theater.play   |  camelot   |   
builtin.encyclopedia.sports.fight_song   |  builtin.encyclopedia.sports.fight_song   |  the cougar song   |   
builtin.encyclopedia.film.series   |  builtin.encyclopedia.film.series   |  the twilight saga   |   
builtin.encyclopedia.tv.program   |  builtin.encyclopedia.tv.program   |  late night with david letterman   |   
builtin.encyclopedia.radio.radio_program   |  builtin.encyclopedia.radio.radio_program   |  grand ole opry   |   
builtin.encyclopedia.film.film   |  builtin.encyclopedia.film.film   |  alice in wonderland   |   
builtin.encyclopedia.cricket.tournament   |  builtin.encyclopedia.cricket.tournament   |  cricket world cup   |   
builtin.encyclopedia.government.government   |  builtin.encyclopedia.government.government   |  european commission   |   
builtin.encyclopedia.sports.team_owner   |  builtin.encyclopedia.sports.team_owner  |  bob castellini   |   
builtin.encyclopedia.music.genre   |  builtin.encyclopedia.music.genre   |  eastern europe   |   
builtin.encyclopedia.ice_hockey.division   |  builtin.encyclopedia.ice_hockey.division   |  hockeyallsvenskan   |   
builtin.encyclopedia.architecture.style   |  builtin.encyclopedia.architecture.style   |  spanish colonial revival architecture   |   
builtin.encyclopedia.broadcast.producer   |  builtin.encyclopedia.broadcast.producer   |  columbia tristar television   |   
builtin.encyclopedia.book.author   |  builtin.encyclopedia.book.author   |  adam maxwell   |   
builtin.encyclopedia.religion.founding_figur   |  builtin.encyclopedia.religion.founding_figur   |  gautama buddha   |   
builtin.encyclopedia.martial_arts.martial_art   |  builtin.encyclopedia.martial_arts.martial_art   |  american kenpo   |   
builtin.encyclopedia.sports.school   |  builtin.encyclopedia.sports.school   |  yale university   |   
builtin.encyclopedia.business.product_line   |  builtin.encyclopedia.business.product_line   |  canon powershot   |   
builtin.encyclopedia.internet.website   |  builtin.encyclopedia.internet.website   |  bing   |   
builtin.encyclopedia.time.holiday   |  builtin.encyclopedia.time.holiday   |  easter   |   
builtin.encyclopedia.food.candy_bar   |  builtin.encyclopedia.food.candy_bar   |  cadbury dairy milk   |   
builtin.encyclopedia.finance.stock_exchange   |  builtin.encyclopedia.finance.stock_exchange   |  tokyo stock exchange   |   
builtin.encyclopedia.film.festival   |  builtin.encyclopedia.film.festival   |  berlin international film festival   |   



