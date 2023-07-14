---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 07/14/2023
ms.author: allensu
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown as follows. 

#### [Test Regions](#tab/TestRegions)

| **Source** | **am** | **auh** | **bl** | **bm** | **bn** |
|--------|-----|-----|-----|-----|-----|
| **am**     |     | 117 |  81 | 129 |  86 |
| **auh**    | 118 |     | 189 |  29 | 187 |
| **bl**     |  83 | 189 |     | 201 |   6 |
| **bm**     | 130 |  29 | 201 |     | 204 |
| **bn**     |  87 | 187 |   7 | 204 |     |
| **brne**   |  89 |  71 | 193 |  39 | 192 |
| **by**     | 143 | 258 |  64 | 220 |  60 |
| **cbr**    | 245 | 170 | 213 | 145 | 209 |
| **cbr2**   | 245 | 169 | 213 | 144 | 209 |
| **ch**     |  99 | 209 |  19 | 221 |  22 |
| **chn**    |  13 | 110 |  94 | 122 |  98 |
| **chw**    |  17 | 107 |  90 | 118 |  94 |
| **clc**    |  89 |  71 | 193 |  39 | 192 |
| **cnn10**  |  89 |  71 | 193 |  39 | 192 |
| **cpt**    | 158 | 272 | 225 | 284 | 229 |
| **cq**     | 184 | 291 | 115 | 302 | 114 |
| **cw**     |  14 | 118 |  80 | 130 |  84 |
| **cy**     | 120 | 234 |  43 | 239 |  44 |
| **db**     |  18 | 124 |  67 | 135 |  71 |
| **den**    |  13 | 122 |  94 | 134 |  98 |
| **dewc**   |   8 | 115 |  87 | 127 |  91 |
| **dm**     | 105 | 221 |  24 | 233 |  27 |
| **dxb**    | 120 |   6 | 190 |  28 | 188 |
| **hel**    |  89 |  71 | 193 |  39 | 192 |
| **hk**     | 187 | 111 | 199 |  85 | 194 |
| **jnb**    | 183 | 256 | 243 | 268 | 248 |
| **krs2**   |  89 |  71 | 193 |  39 | 192 |
| **kul**    |  89 |  71 | 193 |  39 | 192 |
| **ln**     |   9 | 115 |  76 | 127 |  80 |
| **ma**     | 168 |  49 | 235 |  29 | 232 |
| **ml**     | 237 | 160 | 216 | 136 | 211 |
| **mrs**    |  23 | 100 |  92 | 118 |  96 |
| **mwh**    | 142 | 254 |  64 | 211 |  64 |
| **noe**    |  21 | 135 |  99 | 146 | 104 |
| **now**    |  17 | 131 |  96 | 143 |  99 |
| **os**     | 234 | 153 | 162 | 127 | 158 |
| **par**    |  11 | 111 |  82 | 128 |  86 |
| **pn**     | 133 |  33 | 203 |   5 | 204 |
| **ps**     | 216 | 141 | 181 | 115 | 175 |
| **se**     | 222 | 146 | 184 | 120 | 184 |
| **sg**     | 157 |  78 | 222 |  54 | 218 |
| **sn**     | 114 | 215 |  33 | 236 |  28 |
| **sy**     | 240 | 165 | 204 | 140 | 200 |
| **ty**     | 220 | 147 | 155 | 122 | 151 |
| **usw3**   | 131 | 237 |  51 | 233 |  46 |
| **yq**     | 109 | 210 |  27 | 222 |  31 |
| **yt**     | 100 | 201 |  18 | 213 |  22 |
| **yyy**    |  89 |  71 | 193 |  39 | 192 |



#### [Europe](#tab/visual-studio)



--- 

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change regulary. Given this, you can expect an update of this table every 6 to 9 months outside of the addition of new regions. When new regions come online, we will update this document as soon as data is available.

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).