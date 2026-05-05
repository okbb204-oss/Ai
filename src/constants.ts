/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Craft } from './types';

export const CRAFTS: Craft[] = [
  {
    id: 'electrical',
    name: 'Electrical Wiring',
    nameAr: 'الكهرباء المعمارية',
    description: 'The art and science of installing and maintaining electrical systems in buildings.',
    icon: 'Zap',
    tools: ['Multimeter', 'Wire Strippers', 'Conduit Bender', 'Voltage Tester'],
    opportunities: ['Residential Electrician', 'Industrial Technician', 'Solar Panel Installer'],
  },
  {
    id: 'mechanics',
    name: 'Mechanics',
    nameAr: 'الميكانيك',
    description: 'Maintenance and repair of automotive and mechanical machinery.',
    icon: 'Wrench',
    tools: ['Socket Set', 'Torque Wrench', 'Diagnostic Scanner', 'Jack Stands'],
    opportunities: ['Auto Mechanic', 'Heavy Equipment Technician', 'Maintenance Engineer'],
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    nameAr: 'النجارة',
    description: 'Crafting objects and structures from wood with precision and skill.',
    icon: 'Hammer',
    tools: ['Table Saw', 'Chisels', 'Spirit Level', 'Router'],
    opportunities: ['Furniture Maker', 'Construction Carpenter', 'Interior Designer'],
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    nameAr: 'السباكة',
    description: 'Installation and repair of water, gas, and drainage systems.',
    icon: 'Droplets',
    tools: ['Pipe Wrench', 'Plunger', 'PEX Crimp Tool', 'Tube Cutter'],
    opportunities: ['Master Plumber', 'Pipefitter', 'Maintenance Specialist'],
  },
  {
    id: 'welding',
    name: 'Welding',
    nameAr: 'اللحام',
    description: 'Joining metals using high heat and specialized techniques.',
    icon: 'Flame',
    tools: ['Welding Mask', 'MIG/TIG Welder', 'Angle Grinder', 'C-Clamps'],
    opportunities: ['Structural Welder', 'Pipe Welder', 'Underwater Welder'],
  },
  {
    id: 'hvac',
    name: 'HVAC',
    nameAr: 'التبريد والتكييف',
    description: 'Heating, ventilation, and air conditioning systems maintenance.',
    icon: 'Wind',
    tools: ['Manifold Gauge', 'Vacuum Pump', 'Thermometer', 'Leak Detector'],
    opportunities: ['HVAC Technician', 'Refrigeration Specialist', 'Energy Auditor'],
  },
  {
    id: 'painting',
    name: 'Painting',
    nameAr: 'الطلاء',
    description: 'Surface preparation and application of decorative and protective coatings.',
    icon: 'Paintbrush',
    tools: ['Airless Sprayer', 'Rollers', 'Scrapers', 'Heat Gun'],
    opportunities: ['Interior Decorator', 'Industrial Painter', 'Restoration Expert'],
  },
  {
    id: 'barbering',
    name: 'Barbering',
    nameAr: 'الحلاقة',
    description: 'Professional grooming, hair cutting, and styling services.',
    icon: 'Scissors',
    tools: ['Clippers', 'Straight Razor', 'Combs', 'Shears'],
    opportunities: ['Salon Owner', 'Professional Barber', 'Stylist Coordinator'],
  },
  {
    id: 'cooking',
    name: 'Cooking',
    nameAr: 'الطبخ',
    description: 'The professional preparation and presentation of culinary arts.',
    icon: 'Utensils',
    tools: ["Chef's Knife", 'Mandoline', 'Whisk', 'Pressure Cooker'],
    opportunities: ['Executive Chef', 'Pastry Artist', 'Restaurant Manager'],
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    nameAr: 'تصميم الجرافيك',
    description: 'Visual communication using typography, imagery, and layout.',
    icon: 'Palette',
    tools: ['Graphics Tablet', 'Color Calibrator', 'Design Software', 'Sketchbook'],
    opportunities: ['UI/UX Designer', 'Brand Strategist', 'Motion Designer'],
  },
];
