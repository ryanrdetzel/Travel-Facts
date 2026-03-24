import type { Boundary, SimulationWaypoint } from '../../lib/types';

// Simplified boundary data for the AZ → MA corridor (demo/testing)
// Polygons are simplified bounding-box approximations for development

function boxPoly(minLng: number, minLat: number, maxLng: number, maxLat: number): [number, number][][] {
  return [[
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
    [minLng, minLat],
  ]];
}

export const sampleStates: Boundary[] = [
  {
    id: '04', name: 'Arizona', type: 'state', stateCode: 'AZ',
    polygon: boxPoly(-114.82, 31.33, -109.04, 37.0),
    bbox: [-114.82, 31.33, -109.04, 37.0],
    facts: { population: '7,151,502', statehood: '1912', capital: 'Phoenix', nickname: 'The Grand Canyon State', area: '113,990 sq mi', history: 'Arizona became the 48th state in 1912, the last of the contiguous states to be admitted. Home to the Grand Canyon, one of the seven natural wonders of the world, and has a rich Native American heritage spanning thousands of years.' }
  },
  {
    id: '35', name: 'New Mexico', type: 'state', stateCode: 'NM',
    polygon: boxPoly(-109.05, 31.33, -103.0, 37.0),
    bbox: [-109.05, 31.33, -103.0, 37.0],
    facts: { population: '2,117,522', statehood: '1912', capital: 'Santa Fe', nickname: 'Land of Enchantment', area: '121,590 sq mi', history: 'New Mexico, admitted in 1912 alongside Arizona, is one of the oldest settled regions in North America. Santa Fe, founded in 1610, is the oldest state capital. The state is known for its diverse geography, from deserts to mountains, and its blend of Native American, Hispanic, and Anglo cultures.' }
  },
  {
    id: '48', name: 'Texas', type: 'state', stateCode: 'TX',
    polygon: boxPoly(-106.65, 25.84, -93.51, 36.5),
    bbox: [-106.65, 25.84, -93.51, 36.5],
    facts: { population: '29,145,505', statehood: '1845', capital: 'Austin', nickname: 'The Lone Star State', area: '268,596 sq mi', history: 'Texas was an independent republic from 1836 to 1845 before joining the United States. It is the second largest state by both area and population. The state\'s economy is driven by oil, technology, agriculture, and aerospace industries.' }
  },
  {
    id: '40', name: 'Oklahoma', type: 'state', stateCode: 'OK',
    polygon: boxPoly(-103.0, 33.62, -94.43, 37.0),
    bbox: [-103.0, 33.62, -94.43, 37.0],
    facts: { population: '3,959,353', statehood: '1907', capital: 'Oklahoma City', nickname: 'The Sooner State', area: '69,899 sq mi', history: 'Oklahoma became the 46th state in 1907. Originally designated as Indian Territory, it was the endpoint of the Trail of Tears and home to 39 tribal nations. The 1889 Land Run opened unassigned lands to settlers, giving the state its "Sooner" nickname.' }
  },
  {
    id: '29', name: 'Missouri', type: 'state', stateCode: 'MO',
    polygon: boxPoly(-95.77, 36.0, -89.1, 40.61),
    bbox: [-95.77, 36.0, -89.1, 40.61],
    facts: { population: '6,154,913', statehood: '1821', capital: 'Jefferson City', nickname: 'The Show-Me State', area: '69,707 sq mi', history: 'Missouri joined the Union in 1821 as part of the Missouri Compromise. St. Louis served as the Gateway to the West, where Lewis and Clark began their expedition. The Gateway Arch, completed in 1965, commemorates this role in westward expansion.' }
  },
  {
    id: '17', name: 'Illinois', type: 'state', stateCode: 'IL',
    polygon: boxPoly(-91.51, 36.97, -87.02, 42.51),
    bbox: [-91.51, 36.97, -87.02, 42.51],
    facts: { population: '12,812,508', statehood: '1818', capital: 'Springfield', nickname: 'The Prairie State', area: '57,914 sq mi', history: 'Illinois became the 21st state in 1818. Abraham Lincoln began his political career here, and Chicago grew from a small settlement to the nation\'s third-largest city after the Great Chicago Fire of 1871 spurred massive rebuilding.' }
  },
  {
    id: '18', name: 'Indiana', type: 'state', stateCode: 'IN',
    polygon: boxPoly(-88.1, 37.77, -84.78, 41.76),
    bbox: [-88.1, 37.77, -84.78, 41.76],
    facts: { population: '6,785,528', statehood: '1816', capital: 'Indianapolis', nickname: 'The Hoosier State', area: '36,420 sq mi', history: 'Indiana became the 19th state in 1816. Indianapolis hosts the famous Indy 500, the world\'s largest single-day sporting event. The state played a crucial role in the Underground Railroad and was a key manufacturing hub.' }
  },
  {
    id: '39', name: 'Ohio', type: 'state', stateCode: 'OH',
    polygon: boxPoly(-84.82, 38.4, -80.52, 42.32),
    bbox: [-84.82, 38.4, -80.52, 42.32],
    facts: { population: '11,799,448', statehood: '1803', capital: 'Columbus', nickname: 'The Buckeye State', area: '44,826 sq mi', history: 'Ohio was the 17th state, admitted in 1803. It has produced eight U.S. presidents, more than any other state. The Wright Brothers developed powered flight in Dayton, and John Glenn, the first American to orbit Earth, was from Ohio.' }
  },
  {
    id: '42', name: 'Pennsylvania', type: 'state', stateCode: 'PA',
    polygon: boxPoly(-80.52, 39.72, -74.69, 42.27),
    bbox: [-80.52, 39.72, -74.69, 42.27],
    facts: { population: '13,002,700', statehood: '1787', capital: 'Harrisburg', nickname: 'The Keystone State', area: '46,054 sq mi', history: 'Pennsylvania was one of the original 13 colonies and the second state to ratify the Constitution. Philadelphia served as the nation\'s capital and birthplace of the Declaration of Independence and Constitution. The Battle of Gettysburg was a turning point in the Civil War.' }
  },
  {
    id: '34', name: 'New Jersey', type: 'state', stateCode: 'NJ',
    polygon: boxPoly(-75.56, 38.93, -73.89, 41.36),
    bbox: [-75.56, 38.93, -73.89, 41.36],
    facts: { population: '9,288,994', statehood: '1787', capital: 'Trenton', nickname: 'The Garden State', area: '8,723 sq mi', history: 'New Jersey was the third state to ratify the Constitution. Despite its small size, it is the most densely populated state. Thomas Edison\'s laboratory in Menlo Park produced groundbreaking inventions, and the state played key roles in both the Revolutionary and Civil Wars.' }
  },
  {
    id: '36', name: 'New York', type: 'state', stateCode: 'NY',
    polygon: boxPoly(-79.76, 40.5, -71.86, 45.01),
    bbox: [-79.76, 40.5, -71.86, 45.01],
    facts: { population: '20,201,249', statehood: '1788', capital: 'Albany', nickname: 'The Empire State', area: '54,555 sq mi', history: 'New York was the 11th state to ratify the Constitution. New York City served as the first U.S. capital and Ellis Island welcomed over 12 million immigrants. The Erie Canal, completed in 1825, transformed the state into a commercial powerhouse.' }
  },
  {
    id: '09', name: 'Connecticut', type: 'state', stateCode: 'CT',
    polygon: boxPoly(-73.73, 40.95, -71.79, 42.05),
    bbox: [-73.73, 40.95, -71.79, 42.05],
    facts: { population: '3,605,944', statehood: '1788', capital: 'Hartford', nickname: 'The Constitution State', area: '5,543 sq mi', history: 'Connecticut was the fifth state to ratify the Constitution. Its Fundamental Orders of 1639 are considered the first written constitution in the Western tradition. The state became a hub of insurance, manufacturing, and submarine building.' }
  },
  {
    id: '25', name: 'Massachusetts', type: 'state', stateCode: 'MA',
    polygon: boxPoly(-73.51, 41.24, -69.93, 42.89),
    bbox: [-73.51, 41.24, -69.93, 42.89],
    facts: { population: '7,029,917', statehood: '1788', capital: 'Boston', nickname: 'The Bay State', area: '10,554 sq mi', history: 'Massachusetts was the sixth state and a cradle of the American Revolution. The Battles of Lexington and Concord, the Boston Tea Party, and Paul Revere\'s ride all took place here. Home to Harvard (1636), the oldest university in the U.S.' }
  },
];

export const sampleCounties: Boundary[] = [
  {
    id: '04013', name: 'Maricopa County', type: 'county', stateCode: 'AZ',
    polygon: boxPoly(-113.33, 32.51, -111.04, 34.04),
    bbox: [-113.33, 32.51, -111.04, 34.04],
    facts: { population: '4,420,568', countySeat: 'Phoenix', area: '9,224 sq mi', history: 'Maricopa County is the most populous county in Arizona and the fourth most populous in the nation. Named after the Maricopa people, it encompasses the Phoenix metropolitan area and the Sonoran Desert.' }
  },
  {
    id: '04017', name: 'Navajo County', type: 'county', stateCode: 'AZ',
    polygon: boxPoly(-111.0, 33.47, -109.05, 37.0),
    bbox: [-111.0, 33.47, -109.05, 37.0],
    facts: { population: '108,705', countySeat: 'Holbrook', area: '9,953 sq mi', history: 'Navajo County contains part of the Navajo Nation and the Hopi Reservation. The Petrified Forest National Park and Painted Desert attract visitors to see 225-million-year-old fossilized trees.' }
  },
  {
    id: '35031', name: 'McKinley County', type: 'county', stateCode: 'NM',
    polygon: boxPoly(-109.05, 34.58, -107.31, 36.0),
    bbox: [-109.05, 34.58, -107.31, 36.0],
    facts: { population: '72,849', countySeat: 'Gallup', area: '5,455 sq mi', history: 'McKinley County is home to a large portion of the Navajo Nation and the Zuni Pueblo. Gallup is known as the "Indian Capital of the World" and hosts the Inter-Tribal Indian Ceremonial.' }
  },
  {
    id: '35001', name: 'Bernalillo County', type: 'county', stateCode: 'NM',
    polygon: boxPoly(-106.88, 34.77, -106.24, 35.22),
    bbox: [-106.88, 34.77, -106.24, 35.22],
    facts: { population: '676,444', countySeat: 'Albuquerque', area: '1,169 sq mi', history: 'Bernalillo County is the most populous county in New Mexico, centered on Albuquerque. The Sandia Mountains provide a dramatic backdrop, and the annual Balloon Fiesta is the world\'s largest hot air balloon festival.' }
  },
  {
    id: '48375', name: 'Potter County', type: 'county', stateCode: 'TX',
    polygon: boxPoly(-102.17, 35.18, -101.62, 35.62),
    bbox: [-102.17, 35.18, -101.62, 35.62],
    facts: { population: '118,525', countySeat: 'Amarillo', area: '922 sq mi', history: 'Potter County, in the Texas Panhandle, is centered on Amarillo. The area was once home to vast buffalo herds and became a cattle ranching center along Route 66. Cadillac Ranch, an iconic art installation, sits just west of the city.' }
  },
  {
    id: '40017', name: 'Canadian County', type: 'county', stateCode: 'OK',
    polygon: boxPoly(-98.31, 35.29, -97.67, 35.73),
    bbox: [-98.31, 35.29, -97.67, 35.73],
    facts: { population: '148,306', countySeat: 'El Reno', area: '900 sq mi', history: 'Canadian County is named for the Canadian River. El Reno hosts the world\'s largest fried onion burger cookoff. The county saw rapid growth as part of the Oklahoma City metropolitan area.' }
  },
  {
    id: '40109', name: 'Oklahoma County', type: 'county', stateCode: 'OK',
    polygon: boxPoly(-97.67, 35.29, -97.14, 35.73),
    bbox: [-97.67, 35.29, -97.14, 35.73],
    facts: { population: '797,434', countySeat: 'Oklahoma City', area: '718 sq mi', history: 'Oklahoma County is the most populous county in the state, home to Oklahoma City. The city was founded in a single afternoon during the Land Run of 1889, when 10,000 people settled the area in just hours.' }
  },
  {
    id: '29095', name: 'Jackson County', type: 'county', stateCode: 'MO',
    polygon: boxPoly(-94.61, 38.84, -94.1, 39.24),
    bbox: [-94.61, 38.84, -94.1, 39.24],
    facts: { population: '703,011', countySeat: 'Independence', area: '616 sq mi', history: 'Jackson County is home to Kansas City and Independence. Independence was the starting point of the Oregon, California, and Santa Fe Trails. President Harry S. Truman called Independence home.' }
  },
  {
    id: '17031', name: 'Cook County', type: 'county', stateCode: 'IL',
    polygon: boxPoly(-88.26, 41.47, -87.52, 42.15),
    bbox: [-88.26, 41.47, -87.52, 42.15],
    facts: { population: '5,275,541', countySeat: 'Chicago', area: '1,635 sq mi', history: 'Cook County is the second most populous county in the United States after Los Angeles County. Chicago, the county seat, rose to prominence after the Great Fire of 1871 and became a center of architecture, jazz, and industry.' }
  },
  {
    id: '39049', name: 'Franklin County', type: 'county', stateCode: 'OH',
    polygon: boxPoly(-83.21, 39.84, -82.77, 40.17),
    bbox: [-83.21, 39.84, -82.77, 40.17],
    facts: { population: '1,323,807', countySeat: 'Columbus', area: '540 sq mi', history: 'Franklin County is the most populous county in Ohio, centered on the state capital Columbus. Ohio State University, one of the largest in the nation, drives a major research and technology economy.' }
  },
  {
    id: '42003', name: 'Allegheny County', type: 'county', stateCode: 'PA',
    polygon: boxPoly(-80.36, 40.19, -79.7, 40.69),
    bbox: [-80.36, 40.19, -79.7, 40.69],
    facts: { population: '1,250,578', countySeat: 'Pittsburgh', area: '730 sq mi', history: 'Allegheny County, centered on Pittsburgh, sits at the confluence of three rivers. Once the steel capital of the world, Pittsburgh has reinvented itself as a hub of healthcare, technology, and robotics.' }
  },
  {
    id: '25025', name: 'Suffolk County', type: 'county', stateCode: 'MA',
    polygon: boxPoly(-71.19, 42.23, -70.92, 42.4),
    bbox: [-71.19, 42.23, -70.92, 42.4],
    facts: { population: '803,907', countySeat: 'Boston', area: '59 sq mi', history: 'Suffolk County is the smallest county in Massachusetts by area but the most densely populated. It encompasses Boston, the state capital, and is home to numerous universities, hospitals, and historical landmarks from the American Revolution.' }
  },
];

export const sampleTowns: Boundary[] = [
  {
    id: '0455000', name: 'Phoenix', type: 'town', stateCode: 'AZ', countyName: 'Maricopa',
    polygon: boxPoly(-112.33, 33.29, -111.93, 33.81),
    bbox: [-112.33, 33.29, -111.93, 33.81],
    facts: { population: '1,608,139', founded: '1868', elevation: '1,086 ft', area: '518 sq mi', nickname: 'Valley of the Sun', history: 'Phoenix was founded in 1868 near the ruins of a Hohokam civilization canal system. Named for the mythical bird rising from ashes, the city grew rapidly with air conditioning and irrigation, becoming the fifth-largest city in the U.S.' }
  },
  {
    id: '0427820', name: 'Flagstaff', type: 'town', stateCode: 'AZ', countyName: 'Coconino',
    polygon: boxPoly(-111.72, 35.13, -111.56, 35.25),
    bbox: [-111.72, 35.13, -111.56, 35.25],
    facts: { population: '73,964', founded: '1882', elevation: '6,910 ft', area: '64 sq mi', history: 'Flagstaff sits at the base of the San Francisco Peaks and was a stop on Route 66. It is home to Lowell Observatory, where Pluto was discovered in 1930, and Northern Arizona University.' }
  },
  {
    id: '3502000', name: 'Albuquerque', type: 'town', stateCode: 'NM', countyName: 'Bernalillo',
    polygon: boxPoly(-106.76, 34.95, -106.47, 35.22),
    bbox: [-106.76, 34.95, -106.47, 35.22],
    facts: { population: '564,559', founded: '1706', elevation: '5,312 ft', area: '189 sq mi', history: 'Albuquerque was founded as a Spanish colonial outpost in 1706. Nestled along the Rio Grande with the Sandia Mountains as a backdrop, it\'s known for the International Balloon Fiesta and as a crossroads of Route 66.' }
  },
  {
    id: '4803000', name: 'Amarillo', type: 'town', stateCode: 'TX', countyName: 'Potter',
    polygon: boxPoly(-101.94, 35.15, -101.7, 35.27),
    bbox: [-101.94, 35.15, -101.7, 35.27],
    facts: { population: '200,393', founded: '1887', elevation: '3,605 ft', area: '103 sq mi', history: 'Amarillo grew as a cattle-shipping point along the railroad in the Texas Panhandle. Route 66 brought travelers through, and helium discovered nearby earned it the nickname "Helium Capital of the World."' }
  },
  {
    id: '4065000', name: 'Oklahoma City', type: 'town', stateCode: 'OK', countyName: 'Oklahoma',
    polygon: boxPoly(-97.67, 35.33, -97.25, 35.61),
    bbox: [-97.67, 35.33, -97.25, 35.61],
    facts: { population: '681,054', founded: '1889', elevation: '1,201 ft', area: '621 sq mi', history: 'Oklahoma City was settled in a single day during the Land Run of April 22, 1889. It became the state capital in 1910 and grew into an oil and energy hub. The National Cowboy & Western Heritage Museum celebrates its frontier roots.' }
  },
  {
    id: '2938000', name: 'Kansas City', type: 'town', stateCode: 'MO', countyName: 'Jackson',
    polygon: boxPoly(-94.73, 38.88, -94.38, 39.32),
    bbox: [-94.73, 38.88, -94.38, 39.32],
    facts: { population: '508,090', founded: '1838', elevation: '910 ft', area: '319 sq mi', history: 'Kansas City sits at the confluence of the Missouri and Kansas Rivers. Known worldwide for its barbecue and jazz heritage, it was a key hub for westward expansion and the cattle trade.' }
  },
  {
    id: '1714000', name: 'Chicago', type: 'town', stateCode: 'IL', countyName: 'Cook',
    polygon: boxPoly(-87.84, 41.64, -87.52, 42.02),
    bbox: [-87.84, 41.64, -87.52, 42.02],
    facts: { population: '2,746,388', founded: '1833', elevation: '594 ft', area: '234 sq mi', nickname: 'The Windy City', history: 'Chicago was incorporated in 1833 and rebuilt stronger after the Great Fire of 1871. It pioneered the skyscraper, hosted the 1893 World\'s Columbian Exposition, and became a center for blues, jazz, and deep-dish pizza.' }
  },
  {
    id: '1836003', name: 'Indianapolis', type: 'town', stateCode: 'IN', countyName: 'Marion',
    polygon: boxPoly(-86.33, 39.63, -85.94, 39.93),
    bbox: [-86.33, 39.63, -85.94, 39.93],
    facts: { population: '887,642', founded: '1821', elevation: '715 ft', area: '368 sq mi', history: 'Indianapolis was founded in 1821 as a planned city to serve as Indiana\'s capital. The Indianapolis 500, first held in 1911, is the world\'s largest single-day sporting event, drawing over 300,000 spectators.' }
  },
  {
    id: '3918000', name: 'Columbus', type: 'town', stateCode: 'OH', countyName: 'Franklin',
    polygon: boxPoly(-83.13, 39.87, -82.77, 40.13),
    bbox: [-83.13, 39.87, -82.77, 40.13],
    facts: { population: '905,748', founded: '1812', elevation: '902 ft', area: '225 sq mi', history: 'Columbus was founded in 1812 as Ohio\'s state capital. It is home to Ohio State University and has grown into a major technology and research hub. The Short North Arts District and German Village are cultural highlights.' }
  },
  {
    id: '4261000', name: 'Pittsburgh', type: 'town', stateCode: 'PA', countyName: 'Allegheny',
    polygon: boxPoly(-80.1, 40.36, -79.87, 40.5),
    bbox: [-80.1, 40.36, -79.87, 40.5],
    facts: { population: '302,971', founded: '1758', elevation: '1,070 ft', area: '58 sq mi', nickname: 'Steel City', history: 'Pittsburgh sits at the confluence of three rivers and was once the steel capital of the world. After steel\'s decline, the city reinvented itself around healthcare, education, and robotics, with Carnegie Mellon University leading the way.' }
  },
  {
    id: '2507000', name: 'Boston', type: 'town', stateCode: 'MA', countyName: 'Suffolk',
    polygon: boxPoly(-71.19, 42.23, -70.99, 42.4),
    bbox: [-71.19, 42.23, -70.99, 42.4],
    facts: { population: '675,647', founded: '1630', elevation: '141 ft', area: '90 sq mi', nickname: 'Beantown', history: 'Boston was founded in 1630 by Puritan settlers and became the cradle of the American Revolution. The Boston Tea Party, Boston Massacre, and Paul Revere\'s ride all happened here. It\'s home to Harvard, MIT, and world-class hospitals.' }
  },
];

// Simulation path: AZ → MA flight path with waypoints
export const azToMaFlightPath: SimulationWaypoint[] = [
  { lat: 33.45, lng: -112.07, label: 'Phoenix, AZ' },
  { lat: 34.57, lng: -111.54, label: 'Sedona area' },
  { lat: 35.20, lng: -111.63, label: 'Flagstaff, AZ' },
  { lat: 35.49, lng: -109.54, label: 'AZ/NM border' },
  { lat: 35.22, lng: -108.68, label: 'Gallup, NM' },
  { lat: 35.08, lng: -106.65, label: 'Albuquerque, NM' },
  { lat: 35.22, lng: -101.83, label: 'Amarillo, TX' },
  { lat: 35.47, lng: -97.52, label: 'Oklahoma City, OK' },
  { lat: 37.34, lng: -94.70, label: 'Joplin, MO area' },
  { lat: 38.63, lng: -94.34, label: 'Harrisonville, MO' },
  { lat: 39.10, lng: -94.58, label: 'Kansas City, MO' },
  { lat: 39.78, lng: -89.65, label: 'Springfield, IL' },
  { lat: 41.88, lng: -87.63, label: 'Chicago, IL' },
  { lat: 39.77, lng: -86.16, label: 'Indianapolis, IN' },
  { lat: 39.96, lng: -82.99, label: 'Columbus, OH' },
  { lat: 40.44, lng: -79.99, label: 'Pittsburgh, PA' },
  { lat: 40.71, lng: -74.01, label: 'Near NYC, NY' },
  { lat: 41.31, lng: -72.92, label: 'New Haven, CT' },
  { lat: 41.76, lng: -72.68, label: 'Hartford, CT' },
  { lat: 42.10, lng: -72.59, label: 'Springfield, MA' },
  { lat: 42.36, lng: -71.06, label: 'Boston, MA' },
];

// Driving route (more detailed, lower speed)
export const azToMaDrivePath: SimulationWaypoint[] = [
  { lat: 33.45, lng: -112.07, label: 'Phoenix, AZ' },
  { lat: 33.61, lng: -111.89, label: 'Scottsdale, AZ' },
  { lat: 34.17, lng: -111.78, label: 'Camp Verde' },
  { lat: 34.87, lng: -111.76, label: 'Sedona area' },
  { lat: 35.20, lng: -111.63, label: 'Flagstaff, AZ' },
  { lat: 35.29, lng: -111.18, label: 'Winslow, AZ' },
  { lat: 35.40, lng: -110.08, label: 'Holbrook, AZ' },
  { lat: 35.49, lng: -109.54, label: 'AZ/NM border' },
  { lat: 35.22, lng: -108.68, label: 'Gallup, NM' },
  { lat: 35.14, lng: -107.85, label: 'Grants, NM' },
  { lat: 35.08, lng: -106.65, label: 'Albuquerque, NM' },
  { lat: 35.17, lng: -105.97, label: 'Santa Rosa, NM' },
  { lat: 35.17, lng: -103.72, label: 'Tucumcari, NM' },
  { lat: 35.22, lng: -101.83, label: 'Amarillo, TX' },
  { lat: 35.47, lng: -97.52, label: 'Oklahoma City, OK' },
  { lat: 39.10, lng: -94.58, label: 'Kansas City, MO' },
  { lat: 39.80, lng: -89.64, label: 'Springfield, IL' },
  { lat: 41.88, lng: -87.63, label: 'Chicago, IL' },
  { lat: 39.77, lng: -86.16, label: 'Indianapolis, IN' },
  { lat: 39.96, lng: -82.99, label: 'Columbus, OH' },
  { lat: 40.44, lng: -79.99, label: 'Pittsburgh, PA' },
  { lat: 42.36, lng: -71.06, label: 'Boston, MA' },
];
