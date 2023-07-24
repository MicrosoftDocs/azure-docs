---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.author: eur
---

### Suprasegmentals for French

The Speech service phone set puts stress after the vowel of the stressed syllable. However, the `fr-FR` Speech service phone set doesn't support the IPA substress 'ˌ'. If the IPA substress is needed, you should use the IPA directly.

### Vowels for French

| `sapi` | `ipa` | `viseme` | Example 1     | Example 2       | Example 3     |
|--------|-------|----------|---------------|-----------------|---------------|
| ae     | `a`   | 2        | **a**rbre     | p**a**tte       | ir**a**       |
| af     | `ɑ`   | 2        |               | p**â**te        | p**a**s       |
| an     | `ɑ̃`  | 2        | **en**fant    | enf**an**t      | t**em**ps     |
| ax     | `ə`   | 1        |               | p**e**tite      | l**e**        |
| eh     | `ɛ`   | 4        | **e**lle      | p**e**rdu       | ét**ai**t     |
| eu     | `ø`   | 1        | **œu**fs      | cr**eu**ser     | qu**eu**      |
| ey     | `e`   | 4        | **é**mu       | cr**é**tin      | ôt**é**       |
| in     | `ɛ̃`  | 4        | **im**portant | pe**in**ture    | mat**in**     |
| iy     | `i`   | 6        | **i**dée      | pet**i**te      | am**i**       |
| oe     | `œ`   | 4        | **œu**f       | p**eu**r        |               |
| oh     | `ɔ`   | 3        | **o**bstacle  | c**o**rps       |               |
| on     | `ɔ̃`  | 3        | **on**ze      | r**on**deur     | b**on**       |
| ow     | `o`   | 8        | **au**diteur  | b**eau**coup    | p**ô**        |
| un     | `œ̃`  | 4        | **un**        | l**un**di       | br**un**      |
| uw     | `u`   | 7        | **ou**trage   | intr**ou**vable | **ou**        |
| uy     | `y`   | 4        | **u**ne       | p**u**nir       | él**u**       |

### Consonant for French

| `sapi` | `ipa` | `viseme` | Example 1     | Example 2       | Example 3     |
|--------|-------|----------|---------------|-----------------|---------------|
| b      | `b`   | 21       | **b**ête      | ha**b**ille     | ro**b**e      |
| d      | `d`   | 19       | **d**ire      | ron**d**eur     | chau**d**e    |
| f      | `f`   | 18       | **f**emme     | su**ff**ixe     | bo**f**       |
| g      | `g`   | 20       | **g**auche    | é**g**ale       | ba**gu**e     |
| gn     | `ɲ`   | 19       |               |                 | pei**gn**e    |
| hw     | `ɥ`   | 7        | **hu**ile     | n**u**ire       |               |
| k      | `k`   | 20       | **c**arte     | é**c**aille     | be**c**       |
| l      | `l`   | 14       | **l**ong      | é**l**ire       | ba**l**       |
| m      | `m`   | 21       | **m**adame    | ai**m**er       | po**mm**e     |
| n      | `n`   | 19       | **n**ous      | te**n**ir       | bo**nn**e     |
| ng     | `ŋ`   | 20       |               |                 | parki**ng**   |
| p      | `p`   | 21       | **p**atte     | re**p**as       | ca**p**       |
| r      | `ʁ`   | 13       | **r**at       | cha**r**iot     | senti**r**    |
| s      | `s`   | 15       | **s**ourir    | a**ss**ez       | pa**ss**e     |
| sh     | `ʃ`   | 16       | **ch**anter   | ma**ch**ine     | po**ch**e     |
| t      | `t`   | 19       | **t**ête      | ô**t**er        | ne**t**       |
| v      | `v`   | 18       | **v**ent      | in**v**enter    | rê**v**e      |
| w      | `w`   | 7        | **ou**i       | f**ou**ine      |               |
| y      | `j`   | 6        | **y**od       | p**i**étiner    | Marse**ille** |
| z      | `z`   | 15       | **z**éro      | rai**s**onner   | ro**s**e      |
|        | `n‿`   | 19       |               |                 | u**n** arbre  |
|        | `t‿`   | 19       |               |                 | quan**d**     |
|        | `z‿`   | 15       |               |                 | corp**s**     |

<a id="fr-1"></a>
**1** *Only for some foreign words*.

> [!TIP]
> The `fr-FR` Speech service phone set doesn't support the following French liasions, `n‿`, `t‿`, and `z‿`. If they are needed, you should consider using the IPA directly.

> [!NOTE]
> `fr-CA`, `fr-CH` locales don't support SAPI phones now.
