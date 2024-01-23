
# test

Route Directions V2 API returns the ideal route between an origin and a destination for automobile (driving), commercial trucks and walking routes, passing through a series of waypoints if they are specified. A waypoint is a specified geographical location defined by longitude and latitude that is used for navigational purposes. The route will consider factors such as current traffic and the typical road speeds on the requested day of the week and time of day.

The API returns the distance, estimated travel time, and a representation of the route geometry. Additional routing information such as an optimized waypoint order or turn by turn instructions is also available, depending on the parameters used.

Route Directions takes into account local laws, vehicle dimensions, cargo type, max speed, bridge and tunnel heights to calculate the truck specific route and avoid complex maneuvers and difficult roads. Not all trucks can travel the same routes as other vehicles due to certain restrictions based on the vehicle profile or cargo type. For example, highways often have separate speed limits for trucks, some roads do not allow trucks with flammable or hazardous materials, height and weight restriction on bridges.

Route Directions supports up to 25 waypoints and up to 10 viaWaypoints between any two waypoints for driving and walking route. Each set of waypoints creates a separate route Leg. ViaWaypoints define the route path and can be used for route construction through specific locations and do not create route Legs like waypoints. Truck route supports 