---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 07/21/2023
ms.author: allensu
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown as follows. 

#### [North America](#tab/NorthAmerica)

Listing of Western Hemisphere regions including US, Canada, and Brazil.

#### [APAC](#tab/APAC)

Listing of APAC Regions including ...

---

#### [US](#tab/NorthAmerica/US)
|Source|West US|West US 2|West US 3|
|---|---|---|---|
|Australia Central|144|164|158|
|Australia Central 2|144|164|158|
|Australia East|148|160|156|
|Australia Southeast|159|171|167|
|Brazil South|180|182|163|
|Canada Central|61|63|65|
|Canada East|69|73|73|
|Central India|218|210|232|
|Central US|39|38|43|
|East Asia|149|141|151|
|East US|64|64|51|
|East US 2|60|64|47|
|France Central|142|142|130|
|France South|151|149|140|
|Germany North|155|152|143|
|Germany West Central|147|145|135|
|Japan East|106|98|108|
|Japan West|113|105|115|
|Korea Central|130|123|135|
|Korea South|123|116|125|
|North Central US|49|47|51|
|North Europe|132|130|119|
|Norway East|160|157|147|
|Norway West|164|162|150|
|Qatar Central|264|261|250|
|South Africa North|312|309|296|
|South Africa West|294|291|277|
|South Central US|34|45|20|
|South India|202|195|217|
|Southeast Asia|169|162|175|
|Sweden Central|170|168|159|
|Switzerland North|153|151|142|
|Switzerland West|149|148|138|
|UAE Central|258|254|238|
|UAE North|258|256|239|
|UK South|136|134|124|
|UK West|139|137|128|
|West Central US|25|24|31|
|West Europe|147|145|134|
|West India|221|210|233|
|West US||23|17|
|West US 2|23||38|
|West US 3|17|37||


#### [Canada](#tab/NorthAmerica/Canada)

|Source|Brazil South|Canada Central|Canada East|
|---|---|---|---|
|Australia Central|323|204|212|
|Australia Central 2|323|204|212|
|Australia East|319|197|205|
|Australia Southeast|329|209|217|
|Brazil South||129|137|
|Canada Central|128||12|
|Canada East|137|13||
|Central India|305|216|224|
|Central US|147|24|31|
|East Asia|328|198|206|
|East US|115|18|26|
|East US 2|114|22|31|
|France Central|183|98|108|
|France South|193|110|118|
|Germany North|195|112|121|
|Germany West Central|189|105|114|
|Japan East|275|154|162|
|Japan West|285|162|170|
|Korea Central|301|179|187|
|Korea South|296|175|183|
|North Central US|135|18|26|
|North Europe|170|83|92|
|Norway East|203|117|126|
|Norway West|197|107|117|
|Qatar Central|296|207|215|
|South Africa North|345|256|264|
|South Africa West|326|237|245|
|South Central US|141|48|57|
|South India|337|252|260|
|Southeast Asia|340|218|226|
|Sweden Central|206|129|137|
|Switzerland North|196|111|120|
|Switzerland West|192|108|117|
|UAE Central|291|201|210|
|UAE North|292|202|211|
|UK South|177|93|102|
|UK West|180|97|106|
|West Central US|161|42|46|
|West Europe|183|97|106|
|West India|302|213|221|
|West US|179|62|69|
|West US 2|182|64|73|
|West US 3|162|66|73|

#### [Australia](#tab/APAC/Australia)

| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast |
|--------|-------------------|---------------------|----------------|---------------------|
| Australia Central | NaN | 2 | 8 | 14 |
| Australia Central 2 | 2 | NaN | 8 | 14 |
| Australia East | 7 | 8 | NaN | 14 |
| Australia Southeast | 14 | 14 | 14 | NaN |
| Brazil South | 323 | 323 | 319 | 330 |
| Canada Central | 203 | 204 | 197 | 209 |
| Canada East | 212 | 212 | 205 | 217 |
| Central India | 144 | 144 | 140 | 133 |
| Central US | 180 | 181 | 176 | 188 |
| East Asia | 125 | 126 | 123 | 117 |
| East US | 213 | 213 | 204 | 216 |
| East US 2 | 208 | 209 | 200 | 212 |
| France Central | 237 | 238 | 232 | 230 |
| France South | 227 | 227 | 222 | 219 |
| Germany North | 249 | 249 | 244 | 241 |
| Germany West Central | 242 | 242 | 237 | 234 |
| Japan East | 127 | 127 | 101 | 113 |
| Japan West | 135 | 135 | 109 | 120 |
| Korea Central | 152 | 152 | 129 | 141 |
| Korea South | 144 | 144 | 139 | 148 |
| North Central US | 193 | 193 | 188 | 197 |
| North Europe | 251 | 251 | 246 | 243 |
| Norway East | 262 | 262 | 257 | 254 |
| Norway West | 258 | 258 | 253 | 250 |
| Qatar Central | 190 | 191 | 186 | 183 |
| South Africa North | 383 | 384 | 378 | 375 |
| South Africa West | 399 | 399 | 394 | 391 |
| South Central US | 175 | 175 | 173 | 184 |
| South India | 126 | 126 | 121 | 118 |
| Southeast Asia | 94 | 94 | 89 | 83 |
| Sweden Central | 265 | 266 | 261 | 258 |
| Switzerland North | 237 | 237 | 232 | 230 |
| Switzerland West | 234 | 234 | 229 | 226 |
| UAE Central | 170 | 170 | 167 | 161 |
| UAE North | 170 | 171 | 167 | 162 |
| UK South | 242 | 243 | 238 | 235 |
| UK West | 245 | 245 | 240 | 237 |
| West Central US | 166 | 166 | 169 | 180 |
| West Europe | 244 | 245 | 239 | 237 |
| West India | 145 | 145 | 141 | 137 |
| West US | 143 | 144 | 148 | 160 |
| West US 2 | 164 | 164 | 160 | 172 |
| West US 3 | 158 | 158 | 156 | 167 |

#### [Middle East](#tab/APAC/MiddleEast)

| Source | Qatar Central | South Africa North | South Africa West | UAE Central | UAE North |
| --- | --- | --- | --- | --- | --- |
| Australia Central | 191 | 384 | 399 | 170 | 170 |
| Australia Central 2 | 191 | 384 | 399 | 170 | 171 |
| Australia East | 187 | 378 | 394 | 167 | 167 |
| Australia Southeast | 184 | 376 | 391 | 160 | 162 |
| Brazil South | 297 | 345 | 326 | 291 | 292 |
| Canada Central | 207 | 256 | 237 | 201 | 202 |
| Canada East | 215 | 265 | 245 | 210 | 211 |
| Central India | 38 | 270 | 287 | 33 | 33 |
| Central US | 227 | 274 | 256 | 221 | 222 |
| East Asia | 133 | 327 | 342 | 112 | 112 |
| East US | 194 | 243 | 224 | 188 | 189 |
| East US 2 | 197 | 248 | 229 | 187 | 188 |
| France Central | 116 | 172 | 157 | 111 | 111 |
| France South | 106 | 162 | 171 | 100 | 101 |
| Germany North | 128 | 187 | 169 | 122 | 123 |
| Germany West Central | 120 | 180 | 163 | 115 | 116 |
| Japan East | 169 | 358 | 373 | 147 | 148 |
| Japan West | 175 | 372 | 388 | 153 | 156 |
| Korea Central | 170 | 361 | 376 | 146 | 148 |
| Korea South | 163 | 354 | 370 | 140 | 141 |
| North Central US | 215 | 263 | 245 | 209 | 210 |
| North Europe | 130 | 180 | 160 | 124 | 125 |
| Norway East | 140 | 200 | 177 | 135 | 136 |
| Norway West | 137 | 194 | 171 | 131 | 132 |
| Qatar Central | NaN | 269 | 277 | 62 | 62 |
| South Africa North | 268 | NaN | 19 | 256 | 257 |
| South Africa West | 276 | 19 | NaN | 272 | 273 |
| South Central US | 226 | 276 | 259 | 215 | 215 |
| South India | 64 | 302 | 318 | 49 | 50 |
| Southeast Asia | 98 | 296 | 311 | 78 | 80 |
| Sweden Central | 144 | 202 | 180 | 139 | 140 |
| Switzerland North | 116 | 176 | 170 | 110 | 111 |
| Switzerland West | 112 | 172 | 166 | 106 | 107 |
| UAE Central | 62 | 256 | 272 | NaN | 6 |
| UAE North | 62 | 257 | 272 | 6 | NaN |
| UK South | 122 | 173 | 151 | 115 | 116 |
| UK West | 124 | 174 | 154 | 118 | 119 |
| West Central US | 240 | 288 | 270 | 234 | 235 |
| West Europe | 123 | 183 | 157 | 117 | 118 |
| West India | 36 | 268 | 284 | 29 | 29 |
| West US | 264 | 312 | 294 | 258 | 258 |
| West US 2 | 262 | 310 | 291 | 254 | 256 |
| West US 3 | 250 | 296 | 277 | 237 | 239 |

---

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change regulary. Given this, you can expect an update of this table every 6 to 9 months outside of the addition of new regions. When new regions come online, we will update this document as soon as data is available.

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
