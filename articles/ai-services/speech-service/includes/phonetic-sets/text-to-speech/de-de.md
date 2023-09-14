---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.author: eur
---

#### Suprasegmentals for German

| Example&nbsp;1 (Onset for consonant, word-initial for vowel) | Example&nbsp;2 (Intervocalic for consonant, word-medial nucleus for vowel) | Example&nbsp;3 (Coda for consonant, word-final for vowel) | Comments |
|--|--|--|--|
| anders /a **1** n - d ax r s/ | Multiplikationszeichen /m uh l - t iy - p l iy - k a - ts y ow **1** n s - ts ay - c n/ | Biologie /b iy - ow - l ow - g iy **1**/ | Speech service phone set put stress after the vowel of the stressed  syllable |
| Allgemeinwissen /a **2** l - g ax - m ay 1 n - v ih - s n/ | Abfallentsorgungsfirma /a 1 p - f a l - ^ eh n t - z oh **2** ax r - g uh ng s - f ih ax r - m  a/ | Computertomographie /k oh m - p y uw 1 - t ax r - t ow - m ow - g r a - f iy **2**/ | The Speech service phone set puts stress after the vowel of the sub-stressed syllable |

#### Vowels for German

| `sapi` | `ipa`     | VisemeID | Example&nbsp;1                             | Example&nbsp;2     | Example&nbsp;3                          |
|--------|-----------|----------|---------------------------------------|---------------|------------------------------------|
| a:     | `aː`      | 2        | **A**ber                              | Maßst**a**b   | Schem**a**                         |
| a      | `a`       | 2        | **A**bfall                            | B**a**ch      | Agath**a**                         |
| oh     | `ɔ`       | 3        | **O**sten                             | Pf**o**sten   |                                    |
| eh:    | `ɛː`      | 4        | **Ä**hnlichkeit                       | B**ä**r       | Fasci**ae**[<sup>1</sup>](#de-v-1) |
| eh     | `ɛ`       | 4        | **ä**ndern                            | Proz**e**nt   | Amygdal**ae**                      |
| ax     | `ə`       | 1        | 'v**e**rstauen[<sup>2</sup>](#de-v-2) | Aach**e**n    | Frag**e**                          |
| iy     | `iː`      | 6        | **I**ran                              | abb**ie**gt   | Relativitätstheor**ie**            |
| ih     | `ɪ`       | 6        | **I**nnung                            | s**i**ngen    | Wood**y**                          |
| eu     | `øː`      | 1        | **Ö**sen                              | abl**ö**sten  | Malm**ö**                          |
| ow     | `o`, `oː` | 8        | **o**hne                              | Balk**o**n    | Trept**ow**                        |
| oe     | `œ`       | 4        | **Ö**ffnung                           | bef**ö**rdern |                                    |
| ey     | `e`, `eː` | 4        | **E**berhard                          | abf**e**gt    | b                                  |
| uw     | `uː`      | 7        | **U**do                               | H**u**t       | Akk**u**                           |
| uh     | `ʊ`       | 4        | **U**nterschiedes                     | b**u**nt      |                                    |
| ue     | `yː`      | 4        | **Ü**bermut                           | pfl**ü**gt    | Men**ü**                           |
| uy     | `ʏ`       | 7        | **ü**ppig                             | S**y**stem    |                                    |

<a id="de-v-1"></a>
**1** *Only in words of foreign origin, such as Fasci**ae***.<br>
<a id="de-v-2"></a>
**2** *Word-initial only in words of foreign origin, such as **A**ppointment. Syllable-initial in 'v**e**rstauen*.

#### Diphthong for German

| `sapi` | `ipa`       | VisemeID | Example&nbsp;1    | Example&nbsp;2          | Example&nbsp;3 |
|--------|-------------|----------|--------------|--------------------|-----------|
| ay     | `ai`        | 2,6      | **ei**nsam   | Unabhängigk**ei**t | Abt**ei** |
| aw     | `au`        | 2,7      | **au**ßen    | abb**au**st        | St**au**  |
| oy     | `ɔy`, `ɔʏ̯` | 3,4      | **Eu**phorie | tr**äu**mt         | sch**eu** |

#### Semivowels for German

| `sapi` | `ipa` | VisemeID | Example&nbsp;1 | Example&nbsp;2    | Example&nbsp;3  |
|--------|-------|----------|-----------|--------------|------------|
| ax r   | `ɐ`   | 4        |           | abänd**er**n | lock**er** |

#### Consonants for German

| `sapi` | `ipa` | VisemeID | Example&nbsp;1 | Example&nbsp;2 | Example&nbsp;3 |
|--|--|----------|--|--|--|
| b | `b` | 21       | **B**ank | | Pu**b**[<sup>1</sup>](#de-c-1) |
| d | `d` | 19       | **d**anken | Len**d**l[<sup>2</sup>](#de-c-2) | Clau**d**e[<sup>3</sup>](#de-c-3) |
| jh | `ʤ` | 16       | **J**eff | gemana**g**t | Chan**g**e[<sup>4</sup>](#de-c-4) |
| f | `f` | 18       | **F**ahrtdauer | angri**ff**slustig | abbruchrei**f** |
| g | `g` | 20       | **g**ut |  Gre**g**[<sup>5</sup>](#de-c-5) |  |
| h | `h` | 12       | **H**ausanbau |  |  |
| y | `j` | 6        | **J**od | Reakt**i**on | hu**i** |
| k | `k` | 20       | **K**oma | Aspe**k**t | Flec**k** |
| l | `l` | 14       | **l**au | ähne**l**n | zuvie**l** |
| m | `m` | 21       | **M**ut | A**m**t | Leh**m** |
| n | `n` | 19       | **n**un | u**n**d | Huh**n** |
| ng | `ŋ` | 20       | **Ng**uyen[<sup>6</sup>](#de-c-6) | Schwa**nk** | R**ing** |
| p | `p` | 21       | **P**artner | abru**p**t | Ti**p** |
| pf | `pf` | 21,18    | **Pf**erd | dam**pf**t | To**pf** |
| r | `ʀ`, `r`, `ʁ` | 13       | **R**eise | knu**rr**t | Haa**r** |
| s | `s` | 15       | **S**taccato[<sup>7</sup>](#de-c-7) | bi**s**t | mie**s** |
| sh | `ʃ` | 16       | **Sch**ule | mi**sch**t | lappi**sch** |
| t | `t` | 19       | **T**raum | S**t**raße | Mu**t** |
| ts | `ts` | 19,15    | **Z**ug | Ar**z**t | Wit**z** |
| ch | `tʃ` | 19,16    | **Tsch**echien | aufgepu**tsch**t | bundesdeu**tsch** |
| v | `v` | 18       | **w**inken | Q**u**alle | Gr**oo**ve[<sup>8</sup>](#de-c-8) |
| x | `x`[<sup>9</sup>](#de-c-9), `ç`[<sup>10</sup>](#de-c-10) | 12       | Ba**ch**erach[<sup>11</sup>](#de-c-11) | Ma**ch**t mögli**ch**st | Schma**ch** 'i**ch** |
| z | `z` | 15       | **s**uper |  |  |
| zh | `ʒ` | 16       | **G**enre | B**re**ezinski | Edvi**g**e |

<a id="de-c-1"></a>
**1** *Only in words of foreign origin, such as Pu**b***.<br>
<a id="de-c-2"></a>
**2** *Only in words of foreign origin, such as Len**d**l*.<br>
<a id="de-c-3"></a>
**3** *Only in words of foreign origin, such as Clau**d**e*.<br>
<a id="de-c-4"></a>
**4** *Only in words of foreign origin, such as Chan**g**e*.<br>
<a id="de-c-5"></a>
**5** *Word-terminally only in words of foreign origin, such as Gre**g***.<br>
<a id="de-c-6"></a>
**6** *Only in words of  foreign origin, such as **Ng**uyen*.<br>
<a id="de-c-7"></a>
**7** *Only in words of foreign origin, such as **S**taccato*.<br>
<a id="de-c-8"></a>
**8** *Only in words of foreign origin, such as Gr**oo**ve*.<br>
<a id="de-c-9"></a>
**9** *The IPA `x` is a hard "ch" after all non-front vowels (a, aa, oh, ow, uh, uw, and the diphthong aw)*.<br>
<a id="de-c-10"></a>
**10** *The IPA `ç` is a soft "ch" after front vowels (ih, iy, eh, ae, uy, ue, oe, eu, and diphthongs ay, oy) and consonants*.<br>
<a id="de-c-11"></a>
**11** *Word-initial only in words of foreign origin, such as **J**uan. Syllable-initial also in words such as Ba**ch**erach*.<br>

#### Oral consonants for German

| `sapi` | `ipa` | VisemeID | Example                                  |
|--------|-------|----------|------------------------------------------|
| ^      | `ʔ`   | 19        |beachtlich     /b ax - ^ a 1 x t - l ih c/ |

> [!NOTE]
> We need to add a [gs\] phone between two distinct vowels, except when the two vowels are a genuine diphthong. This oral consonant is a glottal stop. For more information, see [glottal stop](http://en.wikipedia.org/wiki/Glottal_stop).
> Besides, `de-CH`,`de-AT` locales don't support SAPI phones now.
