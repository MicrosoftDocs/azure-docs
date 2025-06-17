---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 05/05/2025
ms.author: mbender
ms.custom: references_regions,updatedFY24S2
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown in the following tabs. The latency is measured in milliseconds (ms).

The current dataset was taken on *June 20th, 2024*, and it covers the 30-day period ending on *June 19th, 2024*.

For readability, each table is split into tabs for groups of Azure regions. The tabs are organized by regions, and then by source region in the first column of each table. For example, the *East US* tab also shows the latency from all source regions to the two *East US* regions: *East US* and *East US 2*. 

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change on a regular basis. You can expect an update of these tables every 6 to 9 months. Not all public Azure regions are listed in the following tables. When new regions come online, we will update this document as soon as latency data is available.
> 
> You can perform VM-to-VM latency between regions using [test Virtual Machines](../virtual-network/virtual-network-test-latency.md) in your Azure subscription.

#### [North America / South America](#tab/Americas)

Latency tables for Americas regions including US, Canada, and Brazil.

Use the following tabs to view latency statistics for each region.

#### [Europe](#tab/Europe)

Latency tables for European regions.

Use the following tabs to view latency statistics for each region.

#### [Australia / Asia / Pacific](#tab/APAC)

Latency tables for Australia, Asia, and Pacific regions including and Australia, Japan, Korea, and India.

Use the following tabs to view latency statistics for each region.

#### [Middle East / Africa](#tab/MEA)

Latency tables for Middle East / Africa regions including UAE, South Africa, Israel, and Qatar.

Use the following tabs to view latency statistics for each region.

---

#### [West US](#tab/WestUS/Americas)


| Source | West Central US | West US | West US 2 | West US 3 |
|---|---|---|---|---|
| Australia Central | 163 | 147 | 165 | 150 |
| Australia Central 2 | 163 | 148 | 164 | 150 |
| Australia East | 160 | 142 | 161 | 146 |
| Australia Southeast | 172 | 154 | 172 | 159 |
| Brazil South | 164 | 171 | 185 | 158 |
| Canada Central | 39 | 63 | 61 | 68 |
| Canada East | 47 | 71 | 68 | 75 |
| Central India | 234 | 222 | 213 | 237 |
| Central US | 18 | 42 | 40 | 46 |
| East Asia | 173 | 160 | 152 | 162 |
| East US | 43 | 67 | 64 | 58 |
| East US 2 | 51 | 67 | 71 | 56 |
| France Central | 125 | 144 | 148 | 129 |
| France South | 124 | 146 | 147 | 132 |
| Germany North | 133 | 157 | 156 | 142 |
| Germany West Central | 130 | 154 | 151 | 142 |
| Israel Central | 171 | 194 | 193 | 173 |
| Italy North | 138 | 159 | 160 | 141 |
| Japan East | 120 | 108 | 100 | 112 |
| Japan West | 128 | 116 | 108 | 120 |
| Korea Central | 144 | 131 | 123 | 135 |
| Korea South | 137 | 124 | 116 | 129 |
| Mexico Central | 44 | 55 | 66 | 41 |
| North Central US | 26 | 52 | 49 | 57 |
| North Europe | 112 | 136 | 135 | 120 |
| Norway East | 132 | 158 | 153 | 143 |
| Norway West | 145 | 168 | 166 | 147 |
| Poland Central | 147 | 171 | 170 | 150 |
| Qatar Central | 238 | 257 | 245 | 241 |
| South Africa North | 257 | 270 | 278 | 258 |
| South Africa West | 242 | 255 | 266 | 242 |
| South Central US | 25 | 37 | 47 | 23 |
| South India | 216 | 204 | 195 | 219 |
| Southeast Asia | 183 | 171 | 163 | 187 |
| Sweden Central | 135 | 160 | 156 | 146 |
| Switzerland North | 141 | 161 | 164 | 144 |
| Switzerland West | 130 | 154 | 153 | 139 |
| UAE Central | 228 | 250 | 240 | 230 |
| UAE North | 230 | 253 | 244 | 231 |
| UK South | 120 | 140 | 142 | 128 |
| UK West | 121 | 145 | 142 | 130 |
| West Central US |  | 27 | 26 | 35 |
| West Europe | 126 | 149 | 147 | 133 |
| West US | 26 |  | 24 | 20 |
| West US 2 | 26 | 25 |  | 41 |
| West US 3 | 35 | 22 | 42 |  |

#### [Central US](#tab/CentralUS/Americas)


| Source | Central US | North Central US | South Central US |
|---|---|---|---|
| Australia Central | 178 | 188 | 166 |
| Australia Central 2 | 178 | 188 | 166 |
| Australia East | 174 | 185 | 163 |
| Australia Southeast | 187 | 197 | 175 |
| Brazil South | 150 | 138 | 139 |
| Canada Central | 27 | 19 | 49 |
| Canada East | 35 | 27 | 57 |
| Central India | 220 | 208 | 218 |
| Central US |  | 15 | 28 |
| East Asia | 188 | 199 | 178 |
| East US | 30 | 22 | 38 |
| East US 2 | 37 | 28 | 35 |
| France Central | 118 | 106 | 110 |
| France South | 115 | 103 | 114 |
| Germany North | 124 | 112 | 123 |
| Germany West Central | 120 | 111 | 122 |
| Israel Central | 157 | 145 | 154 |
| Italy North | 124 | 112 | 121 |
| Japan East | 135 | 146 | 131 |
| Japan West | 144 | 154 | 137 |
| Korea Central | 158 | 169 | 156 |
| Korea South | 152 | 163 | 146 |
| Mexico Central | 47 | 59 | 23 |
| North Central US | 15 |  | 39 |
| North Europe | 102 | 90 | 100 |
| Norway East | 123 | 113 | 124 |
| Norway West | 130 | 118 | 128 |
| Poland Central | 133 | 122 | 131 |
| Qatar Central | 225 | 213 | 222 |
| South Africa North | 250 | 234 | 238 |
| South Africa West | 234 | 219 | 223 |
| South Central US | 28 | 38 |  |
| South India | 231 | 220 | 235 |
| Southeast Asia | 199 | 210 | 203 |
| Sweden Central | 127 | 117 | 127 |
| Switzerland North | 127 | 115 | 125 |
| Switzerland West | 121 | 108 | 120 |
| UAE Central | 214 | 203 | 211 |
| UAE North | 216 | 205 | 213 |
| UK South | 108 | 97 | 109 |
| UK West | 110 | 100 | 111 |
| West Central US | 18 | 27 | 25 |
| West Europe | 116 | 103 | 114 |
| West US | 42 | 52 | 36 |
| West US 2 | 41 | 51 | 47 |
| West US 3 | 48 | 56 | 24 |

#### [East US](#tab/EastUS/Americas)


| Source | East US | East US 2 |
|---|---|---|
| Australia Central | 202 | 197 |
| Australia Central 2 | 203 | 198 |
| Australia East | 197 | 193 |
| Australia Southeast | 210 | 206 |
| Brazil South | 118 | 117 |
| Canada Central | 20 | 24 |
| Canada East | 33 | 38 |
| Central India | 187 | 192 |
| Central US | 31 | 38 |
| East Asia | 209 | 208 |
| East US |  | 10 |
| East US 2 | 11 |  |
| France Central | 87 | 85 |
| France South | 84 | 89 |
| Germany North | 93 | 98 |
| Germany West Central | 93 | 92 |
| Israel Central | 124 | 129 |
| Italy North | 92 | 96 |
| Japan East | 164 | 161 |
| Japan West | 172 | 167 |
| Korea Central | 183 | 185 |
| Korea South | 179 | 177 |
| Mexico Central | 54 | 50 |
| North Central US | 21 | 27 |
| North Europe | 72 | 76 |
| Norway East | 95 | 100 |
| Norway West | 98 | 102 |
| Poland Central | 101 | 106 |
| Qatar Central | 192 | 196 |
| South Africa North | 217 | 213 |
| South Africa West | 201 | 197 |
| South Central US | 36 | 34 |
| South India | 199 | 203 |
| Southeast Asia | 228 | 228 |
| Sweden Central | 99 | 108 |
| Switzerland North | 95 | 100 |
| Switzerland West | 90 | 95 |
| UAE Central | 182 | 187 |
| UAE North | 183 | 188 |
| UK South | 79 | 83 |
| UK West | 81 | 86 |
| West Central US | 42 | 49 |
| West Europe | 84 | 88 |
| West US | 65 | 66 |
| West US 2 | 63 | 67 |
| West US 3 | 59 | 56 |

#### [Canada](#tab/Canada/Americas)


| Source | Canada Central | Canada East |
|---|---|---|
| Australia Central | 203 | 211 |
| Australia Central 2 | 203 | 210 |
| Australia East | 199 | 207 |
| Australia Southeast | 211 | 219 |
| Brazil South | 131 | 135 |
| Canada Central |  | 16 |
| Canada East | 15 |  |
| Central India | 202 | 204 |
| Central US | 28 | 35 |
| East Asia | 213 | 221 |
| East US | 21 | 33 |
| East US 2 | 26 | 39 |
| France Central | 101 | 104 |
| France South | 97 | 101 |
| Germany North | 108 | 110 |
| Germany West Central | 107 | 110 |
| Israel Central | 137 | 141 |
| Italy North | 106 | 108 |
| Japan East | 157 | 165 |
| Japan West | 168 | 176 |
| Korea Central | 184 | 194 |
| Korea South | 178 | 185 |
| Mexico Central | 72 | 80 |
| North Central US | 19 | 27 |
| North Europe | 86 | 88 |
| Norway East | 111 | 112 |
| Norway West | 112 | 116 |
| Poland Central | 116 | 119 |
| Qatar Central | 206 | 209 |
| South Africa North | 231 | 239 |
| South Africa West | 217 | 225 |
| South Central US | 49 | 57 |
| South India | 212 | 216 |
| Southeast Asia | 224 | 231 |
| Sweden Central | 118 | 115 |
| Switzerland North | 109 | 112 |
| Switzerland West | 104 | 107 |
| UAE Central | 196 | 198 |
| UAE North | 197 | 200 |
| UK South | 93 | 97 |
| UK West | 95 | 97 |
| West Central US | 39 | 47 |
| West Europe | 99 | 101 |
| West US | 64 | 70 |
| West US 2 | 61 | 68 |
| West US 3 | 71 | 80 |

#### [South America](#tab/SouthAmerica/Americas)


| Source | Brazil South | Mexico Central |
|---|---|---|
| Australia Central | 300 | 187 |
| Australia Central 2 | 300 | 187 |
| Australia East | 297 | 184 |
| Australia Southeast | 309 | 197 |
| Brazil South |  | 159 |
| Canada Central | 132 | 75 |
| Canada East | 135 | 83 |
| Central India | 289 | 238 |
| Central US | 149 | 49 |
| East Asia | 312 | 197 |
| East US | 117 | 57 |
| East US 2 | 119 | 54 |
| France Central | 187 | 131 |
| France South | 185 | 135 |
| Germany North | 194 | 143 |
| Germany West Central | 193 | 142 |
| Israel Central | 226 | 175 |
| Italy North | 193 | 143 |
| Japan East | 262 | 150 |
| Japan West | 270 | 158 |
| Korea Central | 285 | 172 |
| Korea South | 279 | 166 |
| Mexico Central | 157 |  |
| North Central US | 137 | 61 |
| North Europe | 171 | 120 |
| Norway East | 196 | 145 |
| Norway West | 199 | 148 |
| Poland Central | 203 | 152 |
| Qatar Central | 294 | 243 |
| South Africa North | 318 | 258 |
| South Africa West | 303 | 244 |
| South Central US | 138 | 26 |
| South India | 300 | 257 |
| Southeast Asia | 330 | 224 |
| Sweden Central | 200 | 149 |
| Switzerland North | 196 | 145 |
| Switzerland West | 192 | 141 |
| UAE Central | 283 | 232 |
| UAE North | 285 | 234 |
| UK South | 180 | 129 |
| UK West | 184 | 132 |
| West Central US | 164 | 48 |
| West Europe | 185 | 133 |
| West US | 170 | 57 |
| West US 2 | 185 | 68 |
| West US 3 | 158 | 46 |

#### [Western Europe](#tab/WesternEurope/Europe)


| Source | France Central | France South | Switzerland North | Switzerland West | West Europe |
|---|---|---|---|---|---|
| Australia Central | 245 | 234 | 245 | 240 | 253 |
| Australia Central 2 | 245 | 234 | 245 | 240 | 253 |
| Australia East | 242 | 230 | 242 | 237 | 250 |
| Australia Southeast | 236 | 225 | 236 | 231 | 244 |
| Brazil South | 187 | 185 | 196 | 191 | 185 |
| Canada Central | 100 | 97 | 108 | 103 | 98 |
| Canada East | 104 | 100 | 111 | 106 | 100 |
| Central India | 119 | 107 | 118 | 114 | 126 |
| Central US | 118 | 115 | 122 | 117 | 110 |
| East Asia | 182 | 170 | 182 | 177 | 189 |
| East US | 86 | 83 | 94 | 89 | 83 |
| East US 2 | 86 | 89 | 100 | 96 | 89 |
| France Central |  | 14 | 16 | 13 | 13 |
| France South | 16 |  | 15 | 10 | 23 |
| Germany North | 19 | 26 | 16 | 19 | 14 |
| Germany West Central | 12 | 19 | 9 | 12 | 11 |
| Israel Central | 57 | 44 | 52 | 55 | 66 |
| Italy North | 21 | 12 | 9 | 10 | 22 |
| Japan East | 214 | 202 | 213 | 208 | 221 |
| Japan West | 229 | 218 | 229 | 224 | 237 |
| Korea Central | 213 | 201 | 212 | 207 | 220 |
| Korea South | 207 | 195 | 207 | 202 | 215 |
| Mexico Central | 128 | 131 | 142 | 137 | 131 |
| North Central US | 106 | 101 | 113 | 107 | 102 |
| North Europe | 20 | 29 | 31 | 34 | 18 |
| Norway East | 30 | 38 | 28 | 31 | 22 |
| Norway West | 26 | 35 | 31 | 34 | 18 |
| Poland Central | 28 | 34 | 26 | 29 | 22 |
| Qatar Central | 125 | 111 | 120 | 114 | 130 |
| South Africa North | 156 | 154 | 165 | 160 | 163 |
| South Africa West | 140 | 139 | 149 | 145 | 148 |
| South Central US | 110 | 113 | 124 | 119 | 113 |
| South India | 131 | 119 | 129 | 125 | 138 |
| Southeast Asia | 149 | 138 | 152 | 147 | 160 |
| Sweden Central | 34 | 41 | 31 | 34 | 25 |
| Switzerland North | 17 | 14 |  | 7 | 18 |
| Switzerland West | 14 | 10 | 7 |  | 21 |
| UAE Central | 113 | 101 | 113 | 107 | 120 |
| UAE North | 116 | 104 | 115 | 110 | 123 |
| UK South | 11 | 20 | 23 | 19 | 12 |
| UK West | 16 | 25 | 27 | 24 | 15 |
| West Central US | 126 | 124 | 135 | 130 | 121 |
| West Europe | 14 | 23 | 18 | 21 |  |
| West US | 146 | 145 | 157 | 149 | 143 |
| West US 2 | 148 | 146 | 157 | 152 | 142 |
| West US 3 | 130 | 133 | 143 | 139 | 133 |

#### [Central Europe](#tab/CentralEurope/Europe)


| Source | Germany North | Germany West Central | Italy North | Poland Central |
|---|---|---|---|---|
| Australia Central | 258 | 252 | 244 | 265 |
| Australia Central 2 | 257 | 252 | 243 | 265 |
| Australia East | 254 | 249 | 240 | 262 |
| Australia Southeast | 248 | 243 | 234 | 256 |
| Brazil South | 194 | 195 | 194 | 202 |
| Canada Central | 107 | 107 | 107 | 116 |
| Canada East | 110 | 111 | 109 | 118 |
| Central India | 130 | 124 | 117 | 138 |
| Central US | 121 | 122 | 124 | 128 |
| East Asia | 194 | 187 | 180 | 201 |
| East US | 93 | 93 | 92 | 101 |
| East US 2 | 98 | 96 | 98 | 108 |
| France Central | 18 | 12 | 21 | 28 |
| France South | 27 | 22 | 13 | 35 |
| Germany North |  | 12 | 21 | 16 |
| Germany West Central | 11 |  | 14 | 22 |
| Israel Central | 57 | 59 | 50 | 59 |
| Italy North | 20 | 14 |  | 27 |
| Japan East | 225 | 220 | 211 | 234 |
| Japan West | 241 | 235 | 227 | 249 |
| Korea Central | 224 | 219 | 211 | 232 |
| Korea South | 219 | 213 | 205 | 227 |
| Mexico Central | 140 | 140 | 140 | 148 |
| North Central US | 111 | 111 | 112 | 120 |
| North Europe | 27 | 28 | 37 | 35 |
| Norway East | 20 | 24 | 33 | 28 |
| Norway West | 26 | 26 | 35 | 34 |
| Poland Central | 16 | 22 | 28 |  |
| Qatar Central | 131 | 126 | 122 | 142 |
| South Africa North | 168 | 163 | 164 | 177 |
| South Africa West | 153 | 148 | 148 | 162 |
| South Central US | 122 | 122 | 122 | 130 |
| South India | 142 | 136 | 128 | 150 |
| Southeast Asia | 164 | 159 | 150 | 172 |
| Sweden Central | 21 | 27 | 38 | 27 |
| Switzerland North | 16 | 10 | 9 | 26 |
| Switzerland West | 19 | 14 | 12 | 30 |
| UAE Central | 124 | 119 | 110 | 132 |
| UAE North | 126 | 121 | 113 | 134 |
| UK South | 21 | 19 | 28 | 29 |
| UK West | 22 | 23 | 32 | 31 |
| West Central US | 133 | 131 | 139 | 142 |
| West Europe | 13 | 13 | 23 | 22 |
| West US | 155 | 154 | 160 | 165 |
| West US 2 | 155 | 152 | 161 | 163 |
| West US 3 | 142 | 143 | 142 | 150 |

#### [Nordic Countries](#tab/Nordic/Europe)


| Source | Norway East | Norway West | Sweden Central |
|---|---|---|---|
| Australia Central | 270 | 266 | 276 |
| Australia Central 2 | 270 | 266 | 275 |
| Australia East | 266 | 262 | 272 |
| Australia Southeast | 261 | 256 | 266 |
| Brazil South | 196 | 199 | 201 |
| Canada Central | 109 | 111 | 118 |
| Canada East | 112 | 115 | 115 |
| Central India | 142 | 139 | 148 |
| Central US | 122 | 129 | 129 |
| East Asia | 206 | 202 | 211 |
| East US | 95 | 97 | 103 |
| East US 2 | 101 | 104 | 111 |
| France Central | 30 | 25 | 34 |
| France South | 39 | 35 | 44 |
| Germany North | 20 | 26 | 22 |
| Germany West Central | 23 | 25 | 27 |
| Israel Central | 75 | 79 | 76 |
| Italy North | 32 | 34 | 39 |
| Japan East | 238 | 234 | 243 |
| Japan West | 254 | 249 | 259 |
| Korea Central | 237 | 233 | 242 |
| Korea South | 231 | 227 | 236 |
| Mexico Central | 142 | 145 | 147 |
| North Central US | 114 | 118 | 119 |
| North Europe | 29 | 32 | 34 |
| Norway East |  | 10 | 13 |
| Norway West | 11 |  | 19 |
| Poland Central | 29 | 34 | 33 |
| Qatar Central | 144 | 143 | 149 |
| South Africa North | 180 | 176 | 185 |
| South Africa West | 165 | 160 | 171 |
| South Central US | 124 | 127 | 129 |
| South India | 154 | 151 | 160 |
| Southeast Asia | 177 | 172 | 182 |
| Sweden Central | 11 | 17 |  |
| Switzerland North | 28 | 30 | 34 |
| Switzerland West | 32 | 34 | 36 |
| UAE Central | 137 | 133 | 142 |
| UAE North | 139 | 135 | 145 |
| UK South | 29 | 24 | 34 |
| UK West | 31 | 27 | 35 |
| West Central US | 132 | 145 | 136 |
| West Europe | 22 | 18 | 28 |
| West US | 157 | 167 | 160 |
| West US 2 | 154 | 165 | 158 |
| West US 3 | 143 | 147 | 149 |

#### [UK / Northern Europe](#tab/NorthernEurope/Europe)


| Source | North Europe | UK South | UK West |
|---|---|---|---|
| Australia Central | 264 | 251 | 257 |
| Australia Central 2 | 263 | 250 | 257 |
| Australia East | 259 | 247 | 254 |
| Australia Southeast | 253 | 242 | 248 |
| Brazil South | 174 | 180 | 184 |
| Canada Central | 89 | 92 | 95 |
| Canada East | 90 | 96 | 98 |
| Central India | 135 | 124 | 127 |
| Central US | 101 | 107 | 111 |
| East Asia | 198 | 187 | 193 |
| East US | 73 | 78 | 82 |
| East US 2 | 79 | 84 | 89 |
| France Central | 21 | 10 | 16 |
| France South | 32 | 20 | 26 |
| Germany North | 30 | 21 | 24 |
| Germany West Central | 28 | 17 | 22 |
| Israel Central | 77 | 61 | 65 |
| Italy North | 37 | 26 | 32 |
| Japan East | 236 | 219 | 225 |
| Japan West | 244 | 235 | 241 |
| Korea Central | 229 | 218 | 224 |
| Korea South | 224 | 212 | 219 |
| Mexico Central | 120 | 126 | 130 |
| North Central US | 91 | 98 | 103 |
| North Europe |  | 13 | 18 |
| Norway East | 31 | 29 | 32 |
| Norway West | 34 | 24 | 28 |
| Poland Central | 37 | 29 | 32 |
| Qatar Central | 139 | 128 | 136 |
| South Africa North | 171 | 160 | 163 |
| South Africa West | 156 | 145 | 148 |
| South Central US | 102 | 108 | 111 |
| South India | 146 | 135 | 139 |
| Southeast Asia | 169 | 155 | 162 |
| Sweden Central | 34 | 32 | 35 |
| Switzerland North | 34 | 22 | 28 |
| Switzerland West | 37 | 19 | 25 |
| UAE Central | 130 | 118 | 125 |
| UAE North | 131 | 121 | 127 |
| UK South | 15 |  | 8 |
| UK West | 18 | 7 |  |
| West Central US | 109 | 119 | 123 |
| West Europe | 20 | 12 | 15 |
| West US | 133 | 140 | 144 |
| West US 2 | 133 | 142 | 142 |
| West US 3 | 125 | 129 | 134 |

#### [Australasia](#tab/Australasia/APAC)


| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast |
|---|---|---|---|---|
| Australia Central |  | 5 | 10 | 19 |
| Australia Central 2 | 4 |  | 10 | 16 |
| Australia East | 8 | 9 |  | 19 |
| Australia Southeast | 17 | 13 | 18 |  |
| Brazil South | 300 | 301 | 298 | 312 |
| Canada Central | 203 | 204 | 200 | 212 |
| Canada East | 210 | 211 | 208 | 222 |
| Central India | 148 | 148 | 146 | 141 |
| Central US | 178 | 178 | 175 | 189 |
| East Asia | 132 | 131 | 128 | 122 |
| East US | 202 | 203 | 198 | 212 |
| East US 2 | 200 | 199 | 197 | 209 |
| France Central | 245 | 245 | 243 | 239 |
| France South | 235 | 235 | 233 | 229 |
| Germany North | 258 | 258 | 256 | 251 |
| Germany West Central | 251 | 251 | 249 | 244 |
| Israel Central | 276 | 275 | 273 | 268 |
| Italy North | 243 | 243 | 241 | 236 |
| Japan East | 107 | 108 | 105 | 117 |
| Japan West | 115 | 116 | 113 | 124 |
| Korea Central | 129 | 130 | 127 | 139 |
| Korea South | 124 | 124 | 122 | 134 |
| Mexico Central | 185 | 185 | 183 | 196 |
| North Central US | 189 | 189 | 187 | 199 |
| North Europe | 262 | 261 | 258 | 254 |
| Norway East | 270 | 270 | 268 | 263 |
| Norway West | 266 | 266 | 264 | 259 |
| Poland Central | 266 | 266 | 263 | 259 |
| Qatar Central | 180 | 180 | 178 | 174 |
| South Africa North | 272 | 272 | 270 | 265 |
| South Africa West | 289 | 289 | 286 | 282 |
| South Central US | 166 | 166 | 165 | 178 |
| South India | 131 | 131 | 128 | 124 |
| Southeast Asia | 98 | 98 | 95 | 90 |
| Sweden Central | 274 | 274 | 271 | 267 |
| Switzerland North | 246 | 246 | 244 | 239 |
| Switzerland West | 242 | 241 | 239 | 234 |
| UAE Central | 173 | 173 | 170 | 166 |
| UAE North | 176 | 175 | 173 | 168 |
| UK South | 252 | 251 | 249 | 245 |
| UK West | 257 | 257 | 255 | 250 |
| West Central US | 164 | 164 | 163 | 176 |
| West Europe | 254 | 254 | 252 | 247 |
| West US | 148 | 148 | 143 | 156 |
| West US 2 | 165 | 165 | 162 | 175 |
| West US 3 | 151 | 151 | 149 | 163 |

#### [Japan](#tab/Japan/APAC)


| Source | Japan East | Japan West |
|---|---|---|
| Australia Central | 108 | 116 |
| Australia Central 2 | 108 | 117 |
| Australia East | 104 | 113 |
| Australia Southeast | 114 | 123 |
| Brazil South | 264 | 272 |
| Canada Central | 158 | 170 |
| Canada East | 166 | 177 |
| Central India | 122 | 133 |
| Central US | 136 | 145 |
| East Asia | 54 | 52 |
| East US | 165 | 174 |
| East US 2 | 166 | 175 |
| France Central | 214 | 230 |
| France South | 204 | 220 |
| Germany North | 227 | 243 |
| Germany West Central | 219 | 236 |
| Israel Central | 244 | 260 |
| Italy North | 211 | 228 |
| Japan East |  | 14 |
| Japan West | 13 |  |
| Korea Central | 27 | 21 |
| Korea South | 21 | 16 |
| Mexico Central | 148 | 156 |
| North Central US | 147 | 156 |
| North Europe | 235 | 244 |
| Norway East | 239 | 255 |
| Norway West | 235 | 251 |
| Poland Central | 234 | 251 |
| Qatar Central | 154 | 165 |
| South Africa North | 246 | 258 |
| South Africa West | 263 | 274 |
| South Central US | 132 | 142 |
| South India | 105 | 116 |
| Southeast Asia | 72 | 81 |
| Sweden Central | 242 | 260 |
| Switzerland North | 214 | 231 |
| Switzerland West | 210 | 226 |
| UAE Central | 147 | 158 |
| UAE North | 149 | 160 |
| UK South | 220 | 237 |
| UK West | 225 | 242 |
| West Central US | 122 | 131 |
| West Europe | 223 | 241 |
| West US | 108 | 117 |
| West US 2 | 100 | 110 |
| West US 3 | 114 | 122 |

#### [Korea](#tab/Korea/APAC)


| Source | Korea Central | Korea South |
|---|---|---|
| Australia Central | 129 | 123 |
| Australia Central 2 | 129 | 123 |
| Australia East | 125 | 120 |
| Australia Southeast | 136 | 130 |
| Brazil South | 284 | 279 |
| Canada Central | 184 | 176 |
| Canada East | 193 | 184 |
| Central India | 116 | 109 |
| Central US | 158 | 151 |
| East Asia | 41 | 33 |
| East US | 184 | 178 |
| East US 2 | 184 | 177 |
| France Central | 212 | 207 |
| France South | 201 | 195 |
| Germany North | 225 | 219 |
| Germany West Central | 217 | 212 |
| Israel Central | 242 | 236 |
| Italy North | 209 | 204 |
| Japan East | 26 | 20 |
| Japan West | 20 | 14 |
| Korea Central |  | 8 |
| Korea South | 8 |  |
| Mexico Central | 169 | 163 |
| North Central US | 168 | 162 |
| North Europe | 227 | 221 |
| Norway East | 236 | 231 |
| Norway West | 233 | 227 |
| Poland Central | 232 | 226 |
| Qatar Central | 147 | 141 |
| South Africa North | 239 | 233 |
| South Africa West | 255 | 250 |
| South Central US | 156 | 144 |
| South India | 98 | 91 |
| Southeast Asia | 65 | 59 |
| Sweden Central | 240 | 235 |
| Switzerland North | 212 | 206 |
| Switzerland West | 208 | 202 |
| UAE Central | 139 | 133 |
| UAE North | 142 | 136 |
| UK South | 218 | 212 |
| UK West | 223 | 218 |
| West Central US | 144 | 137 |
| West Europe | 221 | 215 |
| West US | 130 | 124 |
| West US 2 | 122 | 116 |
| West US 3 | 135 | 129 |

#### [India](#tab/India/APAC)


| Source | Central India | South India | West India-BM1 |
|---|---|---|---|
| Australia Central | 149 | 130 | 144 |
| Australia Central 2 | 148 | 130 | 144 |
| Australia East | 145 | 126 | 140 |
| Australia Southeast | 139 | 120 | 134 |
| Brazil South | 289 | 300 | 283 |
| Canada Central | 201 | 212 | 195 |
| Canada East | 205 | 215 | 198 |
| Central India |  | 22 | 5 |
| Central US | 220 | 230 | 214 |
| East Asia | 85 | 66 | 80 |
| East US | 188 | 198 | 182 |
| East US 2 | 194 | 204 | 188 |
| France Central | 120 | 130 | 113 |
| France South | 109 | 119 | 102 |
| Germany North | 131 | 141 | 125 |
| Germany West Central | 124 | 134 | 118 |
| Israel Central | 149 | 159 | 143 |
| Italy North | 117 | 127 | 110 |
| Japan East | 122 | 104 | 117 |
| Japan West | 132 | 113 | 127 |
| Korea Central | 117 | 97 | 110 |
| Korea South | 110 | 91 | 105 |
| Mexico Central | 235 | 253 | 229 |
| North Central US | 208 | 219 | 202 |
| North Europe | 134 | 144 | 128 |
| Norway East | 143 | 153 | 137 |
| Norway West | 140 | 150 | 134 |
| Poland Central | 140 | 149 | 133 |
| Qatar Central | 41 | 52 | 36 |
| South Africa North | 135 | 145 | 128 |
| South Africa West | 152 | 161 | 145 |
| South Central US | 218 | 234 | 211 |
| South India | 22 |  | 17 |
| Southeast Asia | 55 | 37 | 50 |
| Sweden Central | 147 | 158 | 141 |
| Switzerland North | 119 | 129 | 113 |
| Switzerland West | 115 | 125 | 109 |
| UAE Central | 35 | 45 | 29 |
| UAE North | 38 | 48 | 31 |
| UK South | 125 | 135 | 119 |
| UK West | 127 | 137 | 120 |
| West Central US | 235 | 216 | 229 |
| West Europe | 128 | 138 | 121 |
| West US | 221 | 202 | 216 |
| West US 2 | 213 | 195 | 209 |
| West US 3 | 237 | 219 | 233 |

#### [Asia](#tab/Asia/APAC)


| Source | East Asia | Southeast Asia |
|---|---|---|
| Australia Central | 131 | 100 |
| Australia Central 2 | 130 | 99 |
| Australia East | 127 | 95 |
| Australia Southeast | 119 | 89 |
| Brazil South | 312 | 331 |
| Canada Central | 212 | 225 |
| Canada East | 221 | 234 |
| Central India | 84 | 56 |
| Central US | 187 | 200 |
| East Asia |  | 38 |
| East US | 209 | 223 |
| East US 2 | 209 | 230 |
| France Central | 182 | 150 |
| France South | 171 | 140 |
| Germany North | 194 | 166 |
| Germany West Central | 187 | 159 |
| Israel Central | 211 | 183 |
| Italy North | 179 | 151 |
| Japan East | 53 | 73 |
| Japan West | 49 | 81 |
| Korea Central | 41 | 67 |
| Korea South | 33 | 61 |
| Mexico Central | 194 | 222 |
| North Central US | 198 | 211 |
| North Europe | 196 | 169 |
| Norway East | 206 | 178 |
| Norway West | 202 | 174 |
| Poland Central | 201 | 173 |
| Qatar Central | 116 | 88 |
| South Africa North | 208 | 180 |
| South Africa West | 224 | 197 |
| South Central US | 179 | 204 |
| South India | 66 | 38 |
| Southeast Asia | 36 |  |
| Sweden Central | 210 | 182 |
| Switzerland North | 182 | 154 |
| Switzerland West | 177 | 149 |
| UAE Central | 108 | 80 |
| UAE North | 111 | 83 |
| UK South | 187 | 156 |
| UK West | 192 | 162 |
| West Central US | 173 | 186 |
| West Europe | 190 | 162 |
| West US | 159 | 172 |
| West US 2 | 152 | 164 |
| West US 3 | 162 | 189 |

#### [Middle East](#tab/MiddleEast/MEA)


| Source | Israel Central | Qatar Central | UAE Central | UAE North |
|---|---|---|---|---|
| Australia Central | 277 | 180 | 172 | 175 |
| Australia Central 2 | 277 | 180 | 172 | 175 |
| Australia East | 274 | 176 | 168 | 172 |
| Australia Southeast | 267 | 170 | 162 | 166 |
| Brazil South | 228 | 294 | 282 | 285 |
| Canada Central | 139 | 204 | 194 | 196 |
| Canada East | 141 | 209 | 197 | 200 |
| Central India | 150 | 40 | 33 | 37 |
| Central US | 158 | 223 | 213 | 216 |
| East Asia | 213 | 116 | 108 | 111 |
| East US | 126 | 191 | 180 | 183 |
| East US 2 | 132 | 199 | 188 | 190 |
| France Central | 59 | 125 | 112 | 116 |
| France South | 46 | 112 | 101 | 105 |
| Germany North | 59 | 132 | 125 | 127 |
| Germany West Central | 59 | 124 | 117 | 120 |
| Israel Central |  | 149 | 142 | 144 |
| Italy North | 52 | 122 | 109 | 112 |
| Japan East | 245 | 153 | 145 | 149 |
| Japan West | 261 | 164 | 156 | 159 |
| Korea Central | 244 | 146 | 139 | 142 |
| Korea South | 238 | 141 | 133 | 137 |
| Mexico Central | 173 | 239 | 229 | 231 |
| North Central US | 146 | 213 | 201 | 204 |
| North Europe | 79 | 137 | 127 | 130 |
| Norway East | 76 | 144 | 136 | 139 |
| Norway West | 81 | 144 | 133 | 135 |
| Poland Central | 61 | 142 | 132 | 134 |
| Qatar Central | 151 |  | 16 | 18 |
| South Africa North | 197 | 116 | 103 | 102 |
| South Africa West | 181 | 132 | 120 | 118 |
| South Central US | 155 | 221 | 211 | 213 |
| South India | 161 | 53 | 45 | 48 |
| Southeast Asia | 183 | 86 | 78 | 82 |
| Sweden Central | 76 | 147 | 140 | 143 |
| Switzerland North | 54 | 121 | 112 | 115 |
| Switzerland West | 58 | 114 | 108 | 110 |
| UAE Central | 144 | 16 |  | 6 |
| UAE North | 146 | 18 | 6 |  |
| UK South | 65 | 128 | 118 | 121 |
| UK West | 66 | 133 | 122 | 126 |
| West Central US | 173 | 239 | 228 | 230 |
| West Europe | 70 | 132 | 120 | 123 |
| West US | 195 | 256 | 249 | 253 |
| West US 2 | 195 | 245 | 238 | 246 |
| West US 3 | 175 | 241 | 231 | 233 |

#### [Africa](#tab/Africa/MEA)


| Source | South Africa North | South Africa West |
|---|---|---|
| Australia Central | 273 | 288 |
| Australia Central 2 | 272 | 287 |
| Australia East | 269 | 284 |
| Australia Southeast | 263 | 278 |
| Brazil South | 319 | 303 |
| Canada Central | 232 | 216 |
| Canada East | 240 | 224 |
| Central India | 135 | 150 |
| Central US | 250 | 233 |
| East Asia | 209 | 224 |
| East US | 217 | 200 |
| East US 2 | 214 | 198 |
| France Central | 156 | 139 |
| France South | 155 | 139 |
| Germany North | 169 | 153 |
| Germany West Central | 163 | 146 |
| Israel Central | 195 | 179 |
| Italy North | 163 | 147 |
| Japan East | 246 | 262 |
| Japan West | 256 | 272 |
| Korea Central | 239 | 255 |
| Korea South | 234 | 250 |
| Mexico Central | 256 | 240 |
| North Central US | 235 | 217 |
| North Europe | 171 | 154 |
| Norway East | 181 | 165 |
| Norway West | 177 | 160 |
| Poland Central | 178 | 161 |
| Qatar Central | 116 | 131 |
| South Africa North |  | 20 |
| South Africa West | 21 |  |
| South Central US | 238 | 222 |
| South India | 146 | 161 |
| Southeast Asia | 179 | 194 |
| Sweden Central | 185 | 169 |
| Switzerland North | 166 | 149 |
| Switzerland West | 162 | 145 |
| UAE Central | 104 | 120 |
| UAE North | 103 | 118 |
| UK South | 162 | 145 |
| UK West | 163 | 147 |
| West Central US | 258 | 242 |
| West Europe | 165 | 148 |
| West US | 270 | 254 |
| West US 2 | 279 | 264 |
| West US 3 | 258 | 242 |


---

Additionally, you can view all of the data in a single table.

:::image type="content" source="media/azure-network-latency/azure-network-latency.png" alt-text="Screenshot of full region latency table" lightbox="media/azure-network-latency/azure-network-latency-thumb.png":::

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).