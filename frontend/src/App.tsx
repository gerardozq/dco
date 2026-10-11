import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

const PARISHES = [
  'Cathedral of the Good Shepherd',
  'Church of St Joseph (Victoria Street)',
  'Church of Saints Peter and Paul',
  'Church of Our Lady of Lourdes',
  'Church of the Sacred Heart',
  'Church of St Teresa',
  'Church of St Alphonsus (Novena Church)',
  'Church of St Bernadette',
  'Church of St Michael the Archangel',
  'Church of the Holy Family',
  'Church of Our Lady Queen of Peace',
  'Church of St Stephen',
  'Church of Our Lady of Perpetual Succour',
  'Church of the Holy Trinity',
  'Church of Divine Mercy',
  'Church of St Ignatius',
  'Church of the Blessed Sacrament',
  'Church of St Mary of the Angels',
  'Church of St Francis of Assisi',
  'Church of the Holy Cross',
  'Church of St Joseph (Bukit Timah)',
  'Church of the Risen Christ',
  'Church of St Anthony',
  'Church of the Holy Spirit',
  'Church of Our Lady Star of the Sea',
  'Church of Christ the King',
  'Church of the Nativity of the Blessed Virgin Mary',
  'Church of the Immaculate Heart of Mary',
  'Church of St Francis Xavier',
  "St Anne's Church",
  'Church of St Vincent de Paul',
  'Church of the Transfiguration',
]
const TEACHING_GROUPS = ['RCIA', 'Youth', 'Primary', 'Secondary', 'Special needs']
const TEACHING_STYLES = ['Storytelling', 'Discussion-led', 'Activity-based', 'Prayer-centred', 'Structured']
const LEARNING_NEEDS = ['Classroom management', 'Engaging students', 'Lesson delivery', 'Lesson planning', 'Praying with children', 'Supporting different learning needs', 'Talking with parents', 'Staying motivated']
const DAYS = ['Weekday', 'Weekend']
const TIMES = ['Morning', 'Afternoon', 'Evening']
const MEETING_SLOTS = [
  'Weekday morning',
  'Weekday afternoon',
  'Weekday evening',
  'Weekend morning',
  'Weekend afternoon',
  'Weekend evening',
]
const PROMPT_TOPICS = [
  'Settling a restless class',
  'Difficult behaviour',
  'Planning a lesson',
  'Praying with children',
  'Talking with parents',
  'Feeling discouraged',
]
const AREAS = ['Central', 'East', 'West']
const SCHEDULE_SUGGESTIONS = [
  { slot: 'Weekend morning', label: 'Sat 17 Oct, 10:00' },
  { slot: 'Weekend morning', label: 'Sat 17 Oct, 11:00' },
  { slot: 'Weekday evening', label: 'Tue 20 Oct, 20:00' },
]
const ICEBREAKERS = [
  'What made you say yes to teaching the very first time?',
  'Describe a moment this month when a child surprised you.',
  'Which Bible story is hardest for you to tell, and why?',
  'Who taught you the faith, and what did they do well?',
  'What small thing keeps you coming back each week?',
]
const RESOURCE_LIBRARY = [
  {
    id: 'class-routines',
    kind: 'Guide · 4 min read',
    title: 'Settling a restless class: five simple routines',
    topic: 'Settling a restless class',
  },
  {
    id: 'opening-prayer',
    kind: 'Video · 6 min',
    title: 'Opening a lesson with a short prayer',
    topic: 'Planning a lesson',
  },
  {
    id: 'quiet-signals',
    kind: 'PDF · 2 pages',
    title: 'Quiet signals that work with young children',
    topic: 'Settling a restless class',
  },
]

type ChatMessage = {
  sender: 'you' | 'mentor' | 'system'
  text: string
}

type Mentor = {
  id: string
  name: string
  parish: string
  area: string
  groups: string[]
  years: number
  styles: string[]
  expertise: string[]
  availability: string[]
  fit: number
  meetingModes: string[]
  tone: number
  bio: string
}

const MENTORS: Mentor[] = [
  {
    id: 'ben',
    name: 'Ben Tan',
    parish: 'Church of St Ignatius',
    area: 'Central',
    groups: ['Primary'],
    years: 14,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 96,
    tone: 0,
    bio: 'Has taught Primary classes for 14 years and helps newer catechists settle in.',
  },
  {
    id: 'daniel',
    name: 'Daniel Rozario',
    parish: 'Church of the Holy Family',
    area: 'East',
    groups: ['Youth', 'Secondary'],
    years: 9,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 78,
    tone: 1,
    bio: 'Leads a Secondary class and enjoys honest conversations with teenagers.',
  },
  {
    id: 'mary',
    name: 'Mary Lourdes Goh',
    parish: 'Holy Family',
    area: 'East',
    groups: ['Primary'],
    years: 11,
    styles: ['Activity-based', 'Storytelling'],
    expertise: ['Engaging students', 'Lesson planning', 'Lesson delivery'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend morning'],
    fit: 91,
    tone: 2,
    bio: 'Builds lessons around crafts and movement for younger children.',
  },
  {
    id: 'josephine',
    name: 'Josephine Lee',
    parish: 'St Ignatius',
    area: 'Central',
    groups: ['Primary', 'Special needs'],
    years: 8,
    styles: ['Activity-based'],
    expertise: ['Classroom management', 'Supporting different learning needs', 'Engaging students'],
    meetingModes: ['Video', 'In person', 'Either'],
    availability: ['Weekend morning', 'Weekend afternoon'],
    fit: 88,
    tone: 4,
    bio: 'Experienced with mixed-ability classes and gentle classroom routines.',
  },
  {
    id: 'clarice',
    name: 'Clarice Ng',
    parish: 'Holy Family',
    area: 'East',
    groups: ['Primary'],
    years: 5,
    styles: ['Storytelling'],
    expertise: ['Lesson delivery', 'Lesson planning', 'Praying with children'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend morning', 'Weekend afternoon'],
    fit: 85,
    tone: 1,
    bio: 'Loves telling Bible stories with props and voices.',
  },
  {
    id: 'agnes',
    name: 'Agnes Wong',
    parish: 'St Ignatius',
    area: 'Central',
    groups: ['Primary'],
    years: 18,
    styles: ['Prayer-centred', 'Storytelling'],
    expertise: ['Praying with children', 'Staying motivated', 'Lesson planning'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend morning', 'Weekday afternoon'],
    fit: 93,
    tone: 0,
    bio: 'A calm presence who has mentored several new catechists.',
  },
  {
    id: 'joseph',
    name: 'Joseph Tay',
    parish: 'Church of the Nativity of the Blessed Virgin Mary',
    area: 'West',
    groups: ['Special needs'],
    years: 10,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Engaging students'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend afternoon'],
    fit: 68,
    tone: 4,
    bio: 'Supports catechists teaching children with special needs.',
  },
  {
    id: 'demo-chinese-01',
    name: 'Aaron Lim',
    parish: 'Church of St Ignatius',
    area: 'Central',
    groups: ['Primary'],
    years: 3,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 70,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-chinese-02',
    name: 'Rachel Chua',
    parish: 'Church of the Holy Family',
    area: 'East',
    groups: ['Secondary'],
    years: 6,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 77,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-chinese-03',
    name: 'Marcus Koh',
    parish: 'Church of the Holy Spirit',
    area: 'West',
    groups: ['Youth'],
    years: 9,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 84,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-chinese-04',
    name: 'Jasmine Teo',
    parish: 'Church of St Vincent de Paul',
    area: 'Central',
    groups: ['Primary', 'Special needs'],
    years: 12,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 91,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-chinese-05',
    name: 'Nicholas Ong',
    parish: 'Church of the Sacred Heart',
    area: 'East',
    groups: ['Youth', 'Secondary'],
    years: 15,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 71,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-chinese-06',
    name: 'Michelle Goh',
    parish: 'Church of St Francis Xavier',
    area: 'West',
    groups: ['Primary'],
    years: 18,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 78,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-chinese-07',
    name: 'Ethan Yeo',
    parish: 'Church of the Risen Christ',
    area: 'Central',
    groups: ['Secondary'],
    years: 3,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 85,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-chinese-08',
    name: 'Grace Lau',
    parish: 'Church of Our Lady of Lourdes',
    area: 'East',
    groups: ['Youth'],
    years: 6,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 92,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-chinese-09',
    name: 'Ryan Seah',
    parish: 'Church of St Ignatius',
    area: 'West',
    groups: ['Primary', 'Special needs'],
    years: 9,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 72,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-chinese-10',
    name: 'Cheryl Toh',
    parish: 'Church of the Holy Family',
    area: 'Central',
    groups: ['Youth', 'Secondary'],
    years: 12,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 79,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-chinese-11',
    name: 'Benjamin Low',
    parish: 'Church of the Holy Spirit',
    area: 'East',
    groups: ['Primary'],
    years: 15,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 86,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-chinese-12',
    name: 'Claudia Tan',
    parish: 'Church of St Vincent de Paul',
    area: 'West',
    groups: ['Secondary'],
    years: 18,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 93,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-chinese-13',
    name: 'Darren Ho',
    parish: 'Church of the Sacred Heart',
    area: 'Central',
    groups: ['Youth'],
    years: 3,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 73,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indian-14',
    name: 'Arun Kumar',
    parish: 'Church of St Francis Xavier',
    area: 'East',
    groups: ['Primary', 'Special needs'],
    years: 6,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 80,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indian-15',
    name: 'Priya Nair',
    parish: 'Church of the Risen Christ',
    area: 'West',
    groups: ['Youth', 'Secondary'],
    years: 9,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 87,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-indian-16',
    name: 'Rahul Menon',
    parish: 'Church of Our Lady of Lourdes',
    area: 'Central',
    groups: ['Primary'],
    years: 12,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 94,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-indian-17',
    name: 'Anita Raj',
    parish: 'Church of St Ignatius',
    area: 'East',
    groups: ['Secondary'],
    years: 15,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 74,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indian-18',
    name: 'Vikram Singh',
    parish: 'Church of the Holy Family',
    area: 'West',
    groups: ['Youth'],
    years: 18,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 81,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indian-19',
    name: 'Deepa Krishnan',
    parish: 'Church of the Holy Spirit',
    area: 'Central',
    groups: ['Primary', 'Special needs'],
    years: 3,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 88,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indian-20',
    name: 'Rohan Pillai',
    parish: 'Church of St Vincent de Paul',
    area: 'East',
    groups: ['Youth', 'Secondary'],
    years: 6,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 95,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-indian-21',
    name: 'Meera Subramaniam',
    parish: 'Church of the Sacred Heart',
    area: 'West',
    groups: ['Primary'],
    years: 9,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 75,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-indian-22',
    name: 'Karthik Raman',
    parish: 'Church of St Francis Xavier',
    area: 'Central',
    groups: ['Secondary'],
    years: 12,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 82,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indian-23',
    name: 'Divya Iyer',
    parish: 'Church of the Risen Christ',
    area: 'East',
    groups: ['Youth'],
    years: 15,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 89,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indian-24',
    name: 'Sanjay Das',
    parish: 'Church of Our Lady of Lourdes',
    area: 'West',
    groups: ['Primary', 'Special needs'],
    years: 18,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 96,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indian-25',
    name: 'Nisha Balakrishnan',
    parish: 'Church of St Ignatius',
    area: 'Central',
    groups: ['Youth', 'Secondary'],
    years: 3,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 76,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-indian-26',
    name: 'Joel D\'Souza',
    parish: 'Church of the Holy Family',
    area: 'East',
    groups: ['Primary'],
    years: 6,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 83,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-indonesian-27',
    name: 'Adrian Wijaya',
    parish: 'Church of the Holy Spirit',
    area: 'West',
    groups: ['Secondary'],
    years: 9,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 90,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indonesian-28',
    name: 'Maria Natalia',
    parish: 'Church of St Vincent de Paul',
    area: 'Central',
    groups: ['Youth'],
    years: 12,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 70,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indonesian-29',
    name: 'Kevin Santoso',
    parish: 'Church of the Sacred Heart',
    area: 'East',
    groups: ['Primary', 'Special needs'],
    years: 15,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 77,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indonesian-30',
    name: 'Clara Hartono',
    parish: 'Church of St Francis Xavier',
    area: 'West',
    groups: ['Youth', 'Secondary'],
    years: 18,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 84,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-indonesian-31',
    name: 'Daniel Pratama',
    parish: 'Church of the Risen Christ',
    area: 'Central',
    groups: ['Primary'],
    years: 3,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 91,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-indonesian-32',
    name: 'Theresia Putri',
    parish: 'Church of Our Lady of Lourdes',
    area: 'East',
    groups: ['Secondary'],
    years: 6,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 71,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indonesian-33',
    name: 'Michael Gunawan',
    parish: 'Church of St Ignatius',
    area: 'West',
    groups: ['Youth'],
    years: 9,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 78,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indonesian-34',
    name: 'Stefanie Kusuma',
    parish: 'Church of the Holy Family',
    area: 'Central',
    groups: ['Primary', 'Special needs'],
    years: 12,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 85,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indonesian-35',
    name: 'Andreas Setiawan',
    parish: 'Church of the Holy Spirit',
    area: 'East',
    groups: ['Youth', 'Secondary'],
    years: 15,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 92,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-indonesian-36',
    name: 'Veronica Limanto',
    parish: 'Church of St Vincent de Paul',
    area: 'West',
    groups: ['Primary'],
    years: 18,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 72,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-indonesian-37',
    name: 'Felix Kurniawan',
    parish: 'Church of the Sacred Heart',
    area: 'Central',
    groups: ['Secondary'],
    years: 3,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 79,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indonesian-38',
    name: 'Cecilia Tanudjaja',
    parish: 'Church of St Francis Xavier',
    area: 'East',
    groups: ['Youth'],
    years: 6,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 86,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-chinese-14',
    name: 'Rachel Lim',
    parish: 'Church of the Risen Christ',
    area: 'West',
    groups: ['Primary', 'Special needs'],
    years: 9,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 93,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-chinese-15',
    name: 'Jonathan Goh',
    parish: 'Church of Our Lady of Lourdes',
    area: 'Central',
    groups: ['Youth', 'Secondary'],
    years: 12,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 73,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-chinese-16',
    name: 'Cheryl Ong',
    parish: 'Church of St Ignatius',
    area: 'East',
    groups: ['Primary'],
    years: 15,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 80,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-chinese-17',
    name: 'Wei Jie Tan',
    parish: 'Church of the Holy Family',
    area: 'West',
    groups: ['Secondary'],
    years: 18,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 87,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indonesian-39',
    name: 'Nicholas Gunawan',
    parish: 'Church of the Holy Spirit',
    area: 'Central',
    groups: ['Youth'],
    years: 3,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 94,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indonesian-40',
    name: 'Felicia Wijaya',
    parish: 'Church of St Vincent de Paul',
    area: 'East',
    groups: ['Primary', 'Special needs'],
    years: 6,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 74,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indonesian-41',
    name: 'Monica Hartono',
    parish: 'Church of the Sacred Heart',
    area: 'West',
    groups: ['Youth', 'Secondary'],
    years: 9,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 81,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
  {
    id: 'demo-indonesian-42',
    name: 'Jonathan Kusuma',
    parish: 'Church of St Francis Xavier',
    area: 'Central',
    groups: ['Primary'],
    years: 12,
    styles: ['Storytelling', 'Prayer-centred'],
    expertise: ['Classroom management', 'Lesson delivery', 'Praying with children'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend morning', 'Weekday evening'],
    fit: 88,
    tone: 0,
    bio: 'Enjoys helping new catechists build confidence and plan engaging lessons.',
  },
  {
    id: 'demo-indian-27',
    name: 'Arjun Menon',
    parish: 'Church of the Risen Christ',
    area: 'East',
    groups: ['Secondary'],
    years: 15,
    styles: ['Discussion-led'],
    expertise: ['Engaging students', 'Lesson planning', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekend afternoon', 'Weekday evening'],
    fit: 95,
    tone: 1,
    bio: 'Supports fellow catechists with practical classroom ideas and prayerful reflection.',
  },
  {
    id: 'demo-indian-28',
    name: 'Sneha Nair',
    parish: 'Church of Our Lady of Lourdes',
    area: 'West',
    groups: ['Youth'],
    years: 18,
    styles: ['Activity-based'],
    expertise: ['Supporting different learning needs', 'Classroom management', 'Staying motivated'],
    meetingModes: ['In person', 'Either'],
    availability: ['Weekday afternoon', 'Weekend morning'],
    fit: 75,
    tone: 2,
    bio: 'Has experience guiding young people and sharing faith through conversation.',
  },
  {
    id: 'demo-indian-29',
    name: 'Rishi Pillai',
    parish: 'Church of St Ignatius',
    area: 'Central',
    groups: ['Primary', 'Special needs'],
    years: 3,
    styles: ['Structured', 'Storytelling'],
    expertise: ['Praying with children', 'Lesson planning', 'Staying motivated'],
    meetingModes: ['Video', 'In person'],
    availability: ['Weekend evening', 'Weekend morning'],
    fit: 82,
    tone: 3,
    bio: 'Loves creating welcoming, activity-based lessons for children.',
  },
  {
    id: 'demo-indian-30',
    name: 'Kavitha Rajan',
    parish: 'Church of the Holy Family',
    area: 'East',
    groups: ['Youth', 'Secondary'],
    years: 6,
    styles: ['Prayer-centred', 'Discussion-led'],
    expertise: ['Engaging students', 'Lesson delivery', 'Talking with parents'],
    meetingModes: ['Video', 'Either'],
    availability: ['Weekday evening', 'Weekend afternoon'],
    fit: 89,
    tone: 4,
    bio: 'Offers a calm, encouraging perspective on the everyday challenges of catechesis.',
  },
]

type MentorFilters = {
  time: string
  parish: string
  area: string
}

const INITIAL_FILTERS: MentorFilters = { time: 'Any', parish: 'Any', area: 'Any' }

type Profile = {
  name: string
  parish: string
  intent: string
  groups: string[]
  seniority: string
  years: string
  education: string
  styles: string[]
  learningNeeds: string[]
  availability: string[]
  meeting: string
  location: string
}

function getMentorReasons(mentor: Mentor, profile: Profile) {
  const reasons: string[] = []
  const sharedGroups = mentor.groups.filter((group) => profile.groups.includes(group))
  const sharedTimes = mentor.availability.filter((slot) => profile.availability.includes(slot))
  const sharedNeeds = mentor.expertise.filter((topic) => profile.learningNeeds.includes(topic))

  if (sharedNeeds.length) reasons.push(`Can help with ${sharedNeeds.slice(0, 2).join(' and ')}`)
  if (sharedGroups.length) reasons.push(`Knows your ${sharedGroups.join(', ')} teaching context`)
  if (sharedTimes.length) reasons.push(`Free ${sharedTimes[0].toLowerCase()}`)
  if (mentor.parish === profile.parish) reasons.push('Same parish')
  if (mentor.styles.some((style) => profile.styles.includes(style))) {
    reasons.push('Similar teaching style')
  }
  if (mentor.meetingModes.includes(profile.meeting) || mentor.meetingModes.includes('Either') || profile.meeting === 'Either') {
    reasons.push(`Open to ${profile.meeting.toLowerCase()} meetings`)
  }

  return reasons
}

function getMentorFit(mentor: Mentor, profile: Profile) {
  const topicMatches = mentor.expertise.filter((topic) => profile.learningNeeds.includes(topic)).length
  const groupMatches = mentor.groups.some((group) => profile.groups.includes(group)) ? 1 : 0
  const timeMatches = mentor.availability.some((slot) => profile.availability.includes(slot)) ? 1 : 0
  const styleMatches = mentor.styles.some((style) => profile.styles.includes(style)) ? 1 : 0
  const meetingMatches = mentor.meetingModes.includes(profile.meeting) || mentor.meetingModes.includes('Either') || profile.meeting === 'Either' ? 1 : 0
  const parishMatches = mentor.parish === profile.parish ? 1 : 0
  const experience = Math.min(mentor.years, 15) / 15
  return Math.min(99, Math.round(42 + topicMatches * 9 + groupMatches * 7 + timeMatches * 5 + styleMatches * 3 + meetingMatches * 3 + parishMatches * 3 + experience * 5))
}

const INITIAL_PROFILE: Profile = {
  name: '',
  parish: '',
  intent: 'Find a mentor',
  groups: [],
  seniority: 'New',
  years: 'Under 1 year',
  education: 'Degree',
  styles: [],
  learningNeeds: [],
  availability: [],
  meeting: 'Video',
  location: 'Anywhere in Singapore',
}

type ChoiceGroupProps = {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
}

function ChoiceGroup({ label, options, selected, onSelect }: ChoiceGroupProps) {
  return (
    <div className="profile-field">
      <span className="field-label">{label}</span>
      <div className="choice-list" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            aria-pressed={selected === option}
            className="choice-chip"
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

type MultiChoiceGroupProps = {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  hint?: string
}

function MultiChoiceGroup({ label, options, selected, onToggle, hint }: MultiChoiceGroupProps) {
  return (
    <div className="profile-field">
      <span className="field-label">{label}</span>
      <div className="choice-list" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            aria-pressed={selected.includes(option)}
            className="choice-chip"
            key={option}
            onClick={() => onToggle(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}

function FishMark({ animated = false }: { animated?: boolean }) {
  return (
    <svg
      className={animated ? 'fish-mark fish-mark-joining' : 'fish-mark'}
      viewBox="68 -2 138 82"
      role="img"
      aria-label="CateLink fish mark"
    >
      <path
        className="fish-mark-gold"
        d="M180.2,75.93c1.69-35.61-30.86-63.18-65.8-57.44-12.07,1.85-23.5,7.7-32.2,16.28-1.03.94-2.26,2.36-3.21,3.37,0,0-7.21-5.78-7.21-5.78.67-.81,1.86-2.41,2.5-3.16,5.8-6.9,12.96-12.73,20.92-16.98,14.66-7.81,32.05-10.2,48.31-6.8,7.8,1.62,15.36,4.58,22.23,8.62,21.65,12.67,35.82,36.76,36.47,61.89,0,0-22.01,0-22.01,0h0Z"
      />
      <path
        className="fish-mark-blue"
        d="M202.21,0c-1.08,39.66-34.21,72.5-73.93,72.01-14.21-.03-28.36-4.48-40.05-12.55-5.53-3.87-10.57-8.51-14.79-13.78,0,0-1.66-2.11-1.66-2.11,0,0,7.21-5.78,7.21-5.78.63.66,1.77,1.95,2.38,2.56,4.59,4.64,9.96,8.58,15.77,11.54,13.1,6.62,28.69,8.1,42.76,3.93,18.58-5.36,33.68-20.64,38.52-39.18,1.45-5.45,2.02-11.07,1.78-16.64h22.01Z"
      />
    </svg>
  )
}

function App() {
  const [email, setEmail] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = window.localStorage.getItem('catelink-theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('catelink-theme', theme)
  }, [theme])
  const themeToggle = <button className="theme-toggle" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminTab, setAdminTab] = useState<'Overview' | 'Users' | 'Mentorships' | 'Meetups'>('Overview')
  const [adminSearch, setAdminSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [showProfile, setShowProfile] = useState(false)
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const [requestStage, setRequestStage] = useState<'detail' | 'confirm' | 'sent' | 'declined' | 'matched' | null>(null)
  const [requestNote, setRequestNote] = useState('')
  const [journeyView, setJourneyView] = useState<
    'match' | 'chat' | 'prompt' | 'inbox' | 'inbox-declined' | 'resources' | 'video' | 'summary'
    | 'meeting-check' | 'meeting-check-done'
  >('match')
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null)
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [promptTopics, setPromptTopics] = useState<string[]>([])
  const [promptText, setPromptText] = useState('')
  const [promptSent, setPromptSent] = useState(false)
  const [promptError, setPromptError] = useState('')
  const [icebreakerIndex, setIcebreakerIndex] = useState(0)
  const [prayerRunning, setPrayerRunning] = useState(false)
  const [prayerSeconds, setPrayerSeconds] = useState(60)
  const [callSeconds, setCallSeconds] = useState(0)
  const [resourceIdsUsed, setResourceIdsUsed] = useState<string[]>([])
  const [resourceIdsSent, setResourceIdsSent] = useState<string[]>([])
  const [resourceIdsHidden, setResourceIdsHidden] = useState<string[]>([])
  const [sessionNotes, setSessionNotes] = useState({ covered: '', tryThisWeek: '', nextSession: '' })
  const [summaryPosted, setSummaryPosted] = useState(false)
  const [summaryRemoved, setSummaryRemoved] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [videoCameraOn, setVideoCameraOn] = useState(true)
  const [callEnded, setCallEnded] = useState(false)
  const [declineReason, setDeclineReason] = useState('Full this term')
  const [inboxReplySent, setInboxReplySent] = useState(false)
  const [callStarter, setCallStarter] = useState('Icebreaker')
  const [joyNote, setJoyNote] = useState('')
  const [struggleNote, setStruggleNote] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim().toLowerCase() === 'benlim.sg@hotmail.com') {
      setIsAdmin(true)
      setAdminTab('Overview')
      setNotice('')
      return
    }

    // The sign-in action opens the existing local profile preview for non-admin emails.
    setNotice('')
    setShowProfile(true)
    setStep(1)
    setComplete(false)
    setFilters(INITIAL_FILTERS)
    setSelectedMentorId(null)
    setRequestStage(null)
    setError('')
  }

  function updateProfile<Key extends keyof Profile>(key: Key, value: Profile[Key]) {
    setProfile((current) => ({ ...current, [key]: value }))
    setError('')
  }

  function toggleProfileList(key: 'groups' | 'styles' | 'learningNeeds' | 'availability', value: string) {
    const selected = profile[key]
    if (selected.includes(value)) {
      updateProfile(key, selected.filter((item) => item !== value))
      return
    }
    if (key === 'styles' && selected.length >= 3) {
      setError('Choose up to three teaching styles.')
      return
    }
    if (key === 'learningNeeds' && selected.length >= 4) {
      setError('Choose up to four areas you would like support with.')
      return
    }
    updateProfile(key, [...selected, value])
  }

  function goBack() {
    setError('')
    if (complete) {
      setComplete(false)
      setStep(3)
    } else if (step > 1) {
      setStep((current) => current - 1)
    } else {
      setShowProfile(false)
    }
  }

  function continueProfile() {
    setError('')
    if (step === 1) {
      if (!profile.name.trim()) {
        setError('Add your full name so your match knows who to expect.')
        return
      }
      setStep(2)
      return
    }
    if (step === 2) {
      if (profile.groups.length === 0) {
        setError('Choose at least one group you teach.')
        return
      }
      setStep(3)
      return
    }
    if (profile.availability.length === 0) {
      setError('Choose at least one time that usually works for you.')
      return
    }
    setComplete(true)
  }

  function openMentor(mentorId: string) {
    setSelectedMentorId(mentorId)
    setRequestStage('detail')
  }

  function beginRequest() {
    if (!selectedMentor) return
    setRequestNote(
      `Hi ${selectedMentor.name.split(' ')[0]}, I am new to ${profile.groups[0] ?? 'catechism'} and would love to learn from you. Could you mentor me?`,
    )
    setRequestStage('confirm')
  }

  function sendRequest() {
    setRequestStage('sent')
  }

  function openChat() {
    if (!selectedMentor) return
    setJourneyView('chat')
    setChatMessages([
      {
        sender: 'system',
        text: selectedMentor.availability.some((slot) => profile.availability.includes(slot))
          ? `You are matched. You both teach ${profile.groups[0] ?? 'catechesis'} and have time in common.`
          : `You are matched. You both teach ${profile.groups[0] ?? 'catechesis'}; find a time that works for both of you.`,
      },
      {
        sender: 'mentor',
        text: `Hi ${profile.name.split(' ')[0] || 'there'}, so glad you reached out. How has your term started?`,
      },
    ])
    setChatDraft('')
    setScheduledSlot(null)
    setPromptTopics([])
    setPromptText('')
    setPromptSent(false)
    setPromptError('')
    setShowSchedule(false)
    setResourceIdsUsed([])
    setResourceIdsSent([])
    setResourceIdsHidden([])
    setSessionNotes({ covered: '', tryThisWeek: '', nextSession: '' })
    setSummaryPosted(false)
    setSummaryRemoved(false)
    setCallSeconds(0)
    setCallStarter('Icebreaker')
    setIcebreakerIndex(0)
    setPrayerRunning(false)
    setPrayerSeconds(60)
    setJoyNote('')
    setStruggleNote('')
    setVideoMuted(false)
    setVideoCameraOn(true)
    setCallEnded(false)
    setJourneyView('chat')
  }

  useEffect(() => {
    if (requestStage !== 'matched' || journeyView !== 'video') return undefined
    const timer = window.setInterval(() => setCallSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [journeyView, requestStage])

  useEffect(() => {
    if (!prayerRunning || prayerSeconds === 0) return undefined
    const timer = window.setInterval(() => setPrayerSeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [prayerRunning, prayerSeconds])

  function sendChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = chatDraft.trim()
    if (!message) return
    setChatMessages((current) => [...current, { sender: 'you', text: message }])
    setChatDraft('')
  }

  function togglePromptTopic(topic: string) {
    setPromptTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    )
    setPromptError('')
  }

  function finishPrompt(send: boolean) {
    if (send && promptTopics.length === 0 && !promptText.trim()) {
      setPromptError('Choose a topic or add a few words, or skip this for now.')
      return
    }
    setPromptSent(send)
    setPromptError('')
    setJourneyView('chat')
  }

  function formatDuration(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  function toggleResource(resourceId: string, action: 'use' | 'send' | 'hide') {
    if (action === 'use') {
      setResourceIdsUsed((current) => current.includes(resourceId)
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId])
      return
    }
    if (action === 'send') {
      const resource = RESOURCE_LIBRARY.find((item) => item.id === resourceId)
      if (!resource) return
      setResourceIdsSent((current) => current.includes(resourceId) ? current : [...current, resourceId])
      setChatMessages((current) => [
        ...current,
        { sender: 'mentor', text: `Shared a resource: ${resource.title}` },
      ])
      return
    }
    setResourceIdsHidden((current) => current.includes(resourceId) ? current : [...current, resourceId])
  }

  function postSummary() {
    const hasNotes = Object.values(sessionNotes).some((note) => note.trim())
    setSessionNotes((current) => hasNotes ? current : {
      ...current,
      covered: 'Thank you for taking time to meet and share your experience.',
    })
    setSummaryPosted(true)
    setSummaryRemoved(false)
    setJourneyView('chat')
    if (!summaryPosted) {
      setChatMessages((current) => [...current, {
        sender: 'system',
        text: 'A session summary was posted to this preview chat.',
      }])
    }
  }

  function endCall() {
    const callNotes = [
      joyNote && `One joy: ${joyNote}`,
      struggleNote && `One struggle: ${struggleNote}`,
    ].filter(Boolean).join('\n')
    setSessionNotes((current) => ({
      ...current,
      covered: current.covered || callNotes,
    }))
    setCallEnded(true)
    setJourneyView('summary')
  }

  const filteredResources = RESOURCE_LIBRARY.filter((resource) =>
    !resourceIdsHidden.includes(resource.id)
    && (promptTopics.length === 0 || promptTopics.includes(resource.topic)),
  ).slice(0, 3)

  function openAlternative(mentorId: string) {
    setSelectedMentorId(mentorId)
    setRequestStage('detail')
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const visibleMentors = MENTORS
    .filter((mentor) =>
      mentor != null
      && (filters.time === 'Any' || mentor.availability?.includes(filters.time))
      && (filters.parish === 'Any' || mentor.parish === filters.parish)
      && (filters.area === 'Any' || mentor.area === filters.area),
    )
    .sort((first, second) => getMentorFit(second, profile) - getMentorFit(first, profile))
    .slice(0, 50)
  // Ignore any empty entries in the mentor list so rendering never crashes.
  const selectedMentor = MENTORS.find((mentor) => mentor != null && mentor.id === selectedMentorId)
  const otherMatches = visibleMentors.filter((mentor) => mentor.id !== selectedMentorId).slice(0, 3)
  const hasSharedAvailability = selectedMentor?.availability.some((slot) =>
    profile.availability.includes(slot),
  ) ?? false
  const sharedScheduleOptions = selectedMentor
    ? SCHEDULE_SUGGESTIONS.filter((suggestion) =>
      profile.availability.includes(suggestion.slot)
      && selectedMentor.availability.includes(suggestion.slot),
    )
    : []


  if (isAdmin) {
    const users = [
      { name: 'Gerald Lim', email: 'gerald.lim@example.com', role: 'Mentee', parish: 'Church of the Holy Family', status: 'Active' },
      { name: 'Ben Tan', email: 'ben.tan@example.com', role: 'Mentor', parish: 'Church of St Ignatius', status: 'Active' },
      { name: 'Mary Lourdes Goh', email: 'mary.goh@example.com', role: 'Mentor', parish: 'Church of the Holy Family', status: 'Active' },
      { name: 'Daniel Rozario', email: 'daniel.r@example.com', role: 'Mentor', parish: 'Church of Our Lady of Lourdes', status: 'Pending' },
    ]
    const pairs = [
      { mentor: 'Ben Tan', mentee: 'Gerald Lim', focus: 'Classroom management', status: 'Active', progress: '2 meetups' },
      { mentor: 'Mary Lourdes Goh', mentee: 'Clarice Ng', focus: 'Engaging students', status: 'Active', progress: '1 meetup' },
      { mentor: 'Daniel Rozario', mentee: 'Alicia Tan', focus: 'Lesson delivery', status: 'Pending', progress: 'Not started' },
    ]
    const meetups = [
      { pair: 'Ben Tan + Gerald Lim', date: '17 Oct 2026 · 10:00 AM', mode: 'Video', status: 'Completed', checkin: 'Both confirmed', note: 'Discussed classroom routines; try a quiet signal this week.' },
      { pair: 'Mary Lourdes Goh + Clarice Ng', date: '18 Oct 2026 · 2:00 PM', mode: 'In person', status: 'Scheduled', checkin: 'Awaiting check-in', note: 'Focus: engaging students through activities.' },
      { pair: 'Daniel Rozario + Alicia Tan', date: '20 Oct 2026 · 8:00 PM', mode: 'Video', status: 'Needs follow-up', checkin: 'No response yet', note: 'Send a gentle reminder to confirm the meeting.' },
    ]
    const filteredUsers = users.filter((user) => [user.name, user.email, user.parish, user.role].some((value) => value.toLowerCase().includes(adminSearch.toLowerCase())))
    return (
      <main className="admin-page"> {themeToggle}
        <aside className="admin-sidebar">
          <div className="admin-brand"><span className="admin-brand-icon"><FishMark /></span><div><strong>CateLink</strong><small>ADMIN SPACE</small></div></div>
          <nav className="admin-nav" aria-label="Admin navigation">
            {(['Overview', 'Users', 'Mentorships', 'Meetups'] as const).map((tab) => <button className={adminTab === tab ? 'admin-nav-item active' : 'admin-nav-item'} key={tab} onClick={() => { setAdminTab(tab); setAdminSearch('') }} type="button"><span aria-hidden="true">{tab === 'Overview' ? '◫' : tab === 'Users' ? '♙' : tab === 'Mentorships' ? '♡' : '◷'}</span>{tab}</button>)}
          </nav>
          <div className="admin-sidebar-bottom"><span className="admin-avatar">BL</span><div><strong>Admin</strong><small>benlim.sg@hotmail.com</small></div><button className="admin-logout" onClick={() => { setIsAdmin(false); setEmail(''); setNotice('') }} type="button">Sign out</button></div>
        </aside>
        <section className="admin-main">
          <header className="admin-topbar"><div><p className="eyebrow">CateLink / Admin</p><h1>{adminTab}</h1><p className="admin-subtitle">A gentle overview of your catechist community.</p></div><div className="admin-topbar-actions"><span className="admin-profile-pill"><span className="admin-avatar">BL</span> Admin</span><button className="admin-logout-button" onClick={() => { setIsAdmin(false); setEmail(''); setNotice(''); setAdminSearch('') }} type="button">↪ Log out</button></div></header>
          {adminTab === 'Overview' && <><div className="admin-welcome-banner"><div><span className="admin-kicker">COMMUNITY CARE</span><h2>Walking together, one catechist at a time.</h2><p>See how your mentoring community is doing and follow up where encouragement may help.</p></div><div className="admin-banner-mark"><FishMark /></div></div><div className="admin-stat-grid">{[{label:'Total users',value:'24',delta:'18 mentees · 6 mentors'},{label:'Active pairs',value:'8',delta:'2 matches awaiting reply'},{label:'Meetups this month',value:'16',delta:'12 completed · 4 upcoming'},{label:'Need follow-up',value:'3',delta:'A gentle check-in may help'}].map((stat) => <article className="admin-stat-card" key={stat.label}><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.delta}</small></article>)}</div><div className="admin-panel"><h2>Needs a little care</h2><p>One meetup needs confirmation, one mentee could use a first-session check-in, and one mentor profile is awaiting review.</p><button className="primary-button admin-action" onClick={() => setAdminTab('Meetups')} type="button">Review meetups</button></div></>}
          {adminTab === 'Users' && <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Community members</h2><p>Sample user records</p></div><input className="admin-search" aria-label="Search users" placeholder="Search name, email, parish..." value={adminSearch} onChange={(event) => setAdminSearch(event.target.value)} /></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Member</th><th>Role</th><th>Parish</th><th>Status</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.email}><td><strong>{user.name}</strong><small>{user.email}</small></td><td>{user.role}</td><td>{user.parish}</td><td><span className="admin-status">{user.status}</span></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <p>No demo users match that search.</p>}</div></section>}
          {adminTab === 'Mentorships' && <section className="admin-panel"><h2>Mentorship pairs</h2><p>Learning goals and progress · demo data</p><div className="admin-pair-grid">{pairs.map((pair) => <article className="admin-pair-card" key={pair.mentor + pair.mentee}><span className="admin-status">{pair.status}</span><h3>{pair.mentor}</h3><p>mentoring</p><h3>{pair.mentee}</h3><div className="admin-pair-focus"><small>LEARNING FOCUS</small><strong>{pair.focus}</strong></div><footer>{pair.progress}</footer></article>)}</div></section>}
          {adminTab === 'Meetups' && <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Meetups & check-ins</h2><p>Meeting history and follow-up notes</p></div><input className="admin-search" aria-label="Search meetups" placeholder="Search pair or status..." value={adminSearch} onChange={(event) => setAdminSearch(event.target.value)} /></div><div className="admin-meetup-list"><p className="field-label">MEETUP CHECK-IN</p>{meetups.filter((meetup) => [meetup.pair, meetup.status, meetup.checkin].some((value) => value.toLowerCase().includes(adminSearch.toLowerCase()))).map((meetup) => <article className="admin-meetup-card" key={meetup.pair}><div className="admin-meetup-top"><div><h3>{meetup.pair}</h3><p>{meetup.date} · {meetup.mode}</p></div><span className="admin-status">{meetup.status}</span></div><div className="admin-checkin"><strong>{meetup.checkin}</strong><p>{meetup.note}</p></div></article>)}</div></section>}
          <footer className="admin-footer">CateLink Admin · Demo dashboard · Not connected to a live database</footer>
        </section>
      </main>
    )
  }

  if (!showProfile) {
    return (
      <main className="welcome-page">{themeToggle}
        <section className="welcome-card" aria-labelledby="welcome-title">
          <div className="brand-mark" aria-hidden="true">
            <FishMark animated />
          </div>

          <div className="brand-copy">
            <h1 id="welcome-title">CateLink</h1>
          </div>

          <p className="welcome-intro">
            Find a fellow catechist to walk with, or offer your experience to someone
            starting out.
          </p>

          <form className="sign-in-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value)
                setNotice('')
              }}
              placeholder="gerald.lim@example.com"
              required
              type="email"
              value={email}
            />
            <button className="primary-button" type="submit">
              {email.trim().toLowerCase() === 'benlim.sg@hotmail.com' ? 'Login as Admin' : 'Send me a sign-in link'}
            </button>
          </form>

          <p className="sign-in-note">No password to remember. We email a link that signs you in.</p>
          <p className="form-notice" role="status" aria-live="polite">{notice}</p>
        </section>

      </main>
    )
  }

  if (complete) {
    if (requestStage === 'matched') {
      if (journeyView === 'chat') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="chat-card" aria-labelledby="chat-title">
              <header className="chat-header">
                <button
                  className="back-button"
                  onClick={() => setJourneyView('match')}
                  type="button"
                >
                  <span aria-hidden="true">←</span> Match
                </button>
                <span className="profile-brand">CATELINK</span>
              </header>

              <div className="chat-partner">
                <span className={`mentor-avatar tone-${selectedMentor?.tone ?? 0}`}>
                  {selectedMentor?.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </span>
                <div>
                  <h1 id="chat-title">{selectedMentor?.name}</h1>
                  <p>{selectedMentor?.parish} · {selectedMentor?.groups.join(', ')} · Mentor</p>
                </div>
                <button
                  aria-label="Choose a session time"
                  className="calendar-button"
                  onClick={() => setShowSchedule(true)}
                  type="button"
                >
                  <span aria-hidden="true">▦</span>
                  <span>Schedule</span>
                </button>
              </div>

              <p className="demo-disclaimer" role="note">
                Preview conversation. Messages and session times stay in this browser and
                aren’t sent to another person.
              </p>

              {scheduledSlot ? (
                <div className="session-banner">
                  <span>Session set for <strong>{scheduledSlot}</strong> · Video (preview)</span>
                  <button className="text-button" onClick={() => setShowSchedule(true)} type="button">
                    Change
                  </button>
                </div>
              ) : (
                <div className="session-banner session-banner-empty">
                  <span>Pick a time to meet</span>
                  <button className="small-primary-button" onClick={() => setShowSchedule(true)} type="button">
                    Choose a time
                  </button>
                </div>
              )}

              <section className="chat-transcript" aria-label="Conversation preview" aria-live="polite">
                {chatMessages.map((message, index) => (
                  message.sender === 'system' ? (
                    <p className="chat-system-message" key={`${message.sender}-${index}`}>
                      {message.text}
                    </p>
                  ) : (
                    <p
                      className={`chat-message ${message.sender === 'you' ? 'chat-message-you' : 'chat-message-mentor'}`}
                      key={`${message.sender}-${index}`}
                    >
                      <span>{message.sender === 'you' ? 'You' : selectedMentor?.name.split(' ')[0]}</span>
                      {message.text}
                    </p>
                  )
                ))}
                {promptSent && (
                  <p className="chat-system-message">
                    Your pre-session questions are ready for {selectedMentor?.name.split(' ')[0]} · preview only
                  </p>
                )}
              </section>

              {scheduledSlot && (
                <section className="pre-session-card">
                  <div>
                    <p className="field-label">Before your session</p>
                    <p>{promptSent ? 'Your questions are ready for your mentor.' : 'Share what you would like help with.'}</p>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setPromptSent(false)
                      setPromptError('')
                      setJourneyView('prompt')
                    }}
                    type="button"
                  >
                    {promptSent ? 'Review questions' : 'Prepare questions'}
                  </button>
                </section>
              )}

              {promptSent && (
                <button
                  className="mentor-preview-link"
                  onClick={() => setJourneyView('resources')}
                  type="button"
                >
                  Preview mentor’s suggested resources
                </button>
              )}

              {scheduledSlot && (
                <button
                  className="video-preview-button"
                  onClick={() => {
                    setCallSeconds(0)
                    setJourneyView('video')
                  }}
                  type="button"
                >
                  Preview video call
                </button>
              )}

              {scheduledSlot && !callEnded && (
                <button
                  className="mentor-preview-link"
                  onClick={() => setJourneyView('meeting-check')}
                  type="button"
                >
                  Preview check for an in-person meeting
                </button>
              )}

              {summaryPosted && !summaryRemoved && (
                <section className="posted-summary">
                  <div className="posted-summary-heading">
                    <div>
                      <span className="field-label">Session summary · preview</span>
                      <p>Drafted from notes you entered during the call.</p>
                    </div>
                    <div className="posted-summary-actions">
                      <button className="text-button" onClick={() => setJourneyView('summary')} type="button">
                        Edit
                      </button>
                      <button
                        className="text-button"
                        onClick={() => setSummaryRemoved(true)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p><strong>What you covered</strong><br />{sessionNotes.covered || 'Thank you for meeting.'}</p>
                  {sessionNotes.tryThisWeek && <p><strong>To try this week</strong><br />{sessionNotes.tryThisWeek}</p>}
                  {sessionNotes.nextSession && <p><strong>Next session</strong><br />{sessionNotes.nextSession}</p>}
                </section>
              )}

              <form className="chat-composer" onSubmit={sendChatMessage}>
                <label className="sr-only" htmlFor="chat-message">Write a message</label>
                <input
                  autoComplete="off"
                  id="chat-message"
                  onChange={(event) => setChatDraft(event.target.value)}
                  placeholder="Write a message"
                  value={chatDraft}
                />
                <button aria-label="Send preview message" disabled={!chatDraft.trim()} type="submit">
                  Send
                </button>
              </form>
            </section>

            {showSchedule && (
              <div className="mentor-overlay">
                <section
                  aria-labelledby="schedule-title"
                  aria-modal="true"
                  className="mentor-sheet schedule-sheet"
                  role="dialog"
                >
                  <button
                    aria-label="Close scheduling"
                    className="sheet-close"
                    onClick={() => setShowSchedule(false)}
                    type="button"
                  >
                    ×
                  </button>
                  <p className="eyebrow">Choose a time</p>
                  <h2 id="schedule-title">When works for both of you?</h2>
                  <p className="field-hint">
                    These sample times are based on the availability you selected. No invite
                    will be sent.
                  </p>
                  {sharedScheduleOptions.length ? (
                    <div className="schedule-options">
                      {sharedScheduleOptions.map((option) => (
                        <button
                          aria-pressed={scheduledSlot === option.label}
                          className="schedule-option"
                          key={option.label}
                          onClick={() => {
                            setScheduledSlot(option.label)
                            setShowSchedule(false)
                          }}
                          type="button"
                        >
                          <span>{option.label}</span>
                          <span>Video · shared availability</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-schedule">
                      <p>You and {selectedMentor?.name.split(' ')[0]} don’t have a shared sample time yet.</p>
                      <p>Update your availability in your profile, or ask your mentor to suggest another time.</p>
                    </div>
                  )}
                  <button
                    className="secondary-button"
                    onClick={() => setShowSchedule(false)}
                    type="button"
                  >
                    Close
                  </button>
                </section>
              </div>
            )}
          </main>
        )
      }

      if (journeyView === 'prompt') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card prompt-card" aria-labelledby="prompt-title">
              <header className="profile-topbar">
                <button className="back-button" onClick={() => setJourneyView('chat')} type="button">
                  <span aria-hidden="true">←</span> Chat
                </button>
                <span className="profile-brand">CATELINK</span>
              </header>
              <p className="eyebrow">Before you meet · preview</p>
              <h1 className="profile-title" id="prompt-title">
                What would you like to ask {selectedMentor?.name.split(' ')[0]}?
              </h1>
              <p className="profile-description">
                A few words are enough. This preview keeps your answers on this device;
                nothing is sent to your mentor.
              </p>
              <div className="profile-fields">
                <div className="profile-field">
                  <span className="field-label">Choose any topics</span>
                  <div className="choice-list" role="group" aria-label="Topics to discuss">
                    {PROMPT_TOPICS.map((topic) => (
                      <button
                        aria-pressed={promptTopics.includes(topic)}
                        className="choice-chip"
                        key={topic}
                        onClick={() => togglePromptTopic(topic)}
                        type="button"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="profile-field">
                  <label className="field-label" htmlFor="prompt-text">In your own words</label>
                  <textarea
                    className="profile-input request-note"
                    id="prompt-text"
                    onChange={(event) => {
                      setPromptText(event.target.value)
                      setPromptError('')
                    }}
                    placeholder="What would you like your mentor’s advice on?"
                    value={promptText}
                  />
                </div>
              </div>
              {promptError && <p className="profile-error" role="alert">{promptError}</p>}
              <div className="completion-actions">
                <button className="primary-button" onClick={() => finishPrompt(true)} type="button">
                  Preview sending questions
                </button>
                <button className="secondary-button" onClick={() => finishPrompt(false)} type="button">
                  Skip for now
                </button>
              </div>
              <p className="field-hint prompt-timing">
                In the full app, this prompt would appear before your scheduled session.
              </p>
            </section>
          </main>
        )
      }

      if (journeyView === 'inbox') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card inbox-card" aria-labelledby="inbox-title">
              <header className="profile-topbar">
                <button className="back-button" onClick={() => setJourneyView('match')} type="button">
                  <span aria-hidden="true">←</span> Match preview
                </button>
                <span className="profile-brand">CATELINK</span>
              </header>
              <p className="eyebrow">Mentor view · preview</p>
              <h1 className="profile-title" id="inbox-title">
                Hello, {selectedMentor?.name.split(' ')[0]}
              </h1>
              <p className="profile-description">A catechist is hoping you can walk with them this term.</p>
              <p className="demo-disclaimer" role="note">
                Sample request only. Accepting or declining here does not contact anyone.
              </p>
              <section className="capacity-card" aria-label="Mentoring capacity preview">
                <span className="field-label">Your mentoring this term</span>
                <div className="capacity-meter" aria-hidden="true">
                  <span /><i />
                </div>
                <p>1 of 2 places in use · sample capacity</p>
              </section>
              <article className="request-card">
                <div className="request-person">
                  <span className="mentor-avatar tone-2">
                    {profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'GL'}
                  </span>
                  <div>
                    <h2>{profile.name || 'Gerald Lim'}</h2>
                    <p>{profile.parish} · {profile.groups.join(', ')} · {profile.seniority}</p>
                  </div>
                  <strong>{selectedMentor?.fit ?? 94}%</strong>
                </div>
                <blockquote>
                  {requestNote.trim()
                    || `Hi ${selectedMentor?.name.split(' ')[0]}, I am new to ${profile.groups[0] ?? 'catechism'} and would love to learn from you. Could you mentor me?`}
                </blockquote>
                <div className="choice-list">
                  <span className="choice-chip reason-chip">Teaches {profile.groups.join(', ') || 'catechesis'} like you</span>
                  {hasSharedAvailability && (
                    <span className="choice-chip reason-chip">Free at a time you selected</span>
                  )}
                  <span className="choice-chip reason-chip">Prefers {profile.meeting.toLowerCase()}</span>
                </div>
                <div className="sheet-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setJourneyView('inbox-declined')}
                    type="button"
                  >
                    Not right now
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => {
                      setRequestStage('matched')
                      setJourneyView('match')
                    }}
                    type="button"
                  >
                    Accept request
                  </button>
                </div>
              </article>
            </section>
          </main>
        )
      }

      if (journeyView === 'meeting-check') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card completion-card" aria-labelledby="meeting-check-title">
              <FishMark />
              <p className="eyebrow">A private check-in · preview</p>
              <h1 className="profile-title" id="meeting-check-title">
                Did you and {selectedMentor?.name.split(' ')[0]} meet on {scheduledSlot?.split(',')[0]}?
              </h1>
              <p className="profile-description">
                This helps the mentoring program understand whether meetings are happening.
                Only your yes or no is shared—not what you talked about.
              </p>
              <p className="demo-disclaimer" role="note">
                In the full app, this is sent separately to each person the day after an
                external meeting. In-app calls are marked held automatically.
              </p>
              <div className="completion-actions">
                <button
                  className="primary-button"
                  onClick={() => setJourneyView('meeting-check-done')}
                  type="button"
                >
                  Yes, we met
                </button>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setJourneyView('chat')
                    setShowSchedule(true)
                  }}
                  type="button"
                >
                  Not yet, find a new time
                </button>
              </div>
            </section>
          </main>
        )
      }

      if (journeyView === 'meeting-check-done') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card completion-card" aria-labelledby="meeting-thanks-title">
              <span className="completion-icon" aria-hidden="true">✓</span>
              <p className="eyebrow">Thank you</p>
              <h1 className="profile-title" id="meeting-thanks-title">Lovely to hear it</h1>
              <p className="profile-description">
                Would you like to set the next time with {selectedMentor?.name.split(' ')[0]} now?
              </p>
              <div className="completion-actions">
                <button
                  className="primary-button"
                  onClick={() => {
                    setJourneyView('chat')
                    setShowSchedule(true)
                  }}
                  type="button"
                >
                  Choose a next session
                </button>
                <button className="secondary-button" onClick={() => setJourneyView('chat')} type="button">
                  Back to chat
                </button>
              </div>
            </section>
          </main>
        )
      }

      if (journeyView === 'inbox-declined') {
        if (inboxReplySent) {
          return (
            <main className="welcome-page profile-page journey-page">{themeToggle}
              <section className="profile-card completion-card" aria-labelledby="kind-reply-title">
                <span className="completion-icon" aria-hidden="true">✓</span>
                <p className="eyebrow">Kind reply · preview only</p>
                <h1 className="profile-title" id="kind-reply-title">A kind reply is ready</h1>
                <p className="profile-description">
                  {profile.name.split(' ')[0] || 'Gerald'} would be told that
                  {' '}{selectedMentor?.name.split(' ')[0] || 'the mentor'} cannot take a new mentee right now.
                  Your private reason (“{declineReason}”) is not shared.
                </p>
                <div className="completion-actions">
                  <button
                    className="primary-button"
                    onClick={() => {
                      setInboxReplySent(false)
                      setJourneyView('match')
                    }}
                    type="button"
                  >
                    Return to match preview
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setInboxReplySent(false)
                      setJourneyView('inbox')
                    }}
                    type="button"
                  >
                    Back to inbox
                  </button>
                </div>
              </section>
            </main>
          )
        }
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card completion-card" aria-labelledby="mentor-decline-title">
              <p className="eyebrow">Kind reply · preview</p>
              <h1 className="profile-title" id="mentor-decline-title">
                Reply kindly to {profile.name.split(' ')[0] || 'Gerald'}?
              </h1>
              <p className="profile-description">
                We would let them know you cannot take a new mentee right now. That is
                perfectly normal, and they can explore other mentors. Your reason stays private.
              </p>
              <div className="profile-fields">
                <span className="field-label">Your reason · private</span>
                {['Full this term', 'Away for a while', 'Prefer not to say'].map((reason) => (
                  <button
                    aria-pressed={declineReason === reason}
                    className="schedule-option"
                    key={reason}
                    onClick={() => setDeclineReason(reason)}
                    type="button"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="completion-actions">
                <button
                  className="primary-button"
                  onClick={() => setInboxReplySent(true)}
                  type="button"
                >
                  Send kind reply · preview
                </button>
                <button className="secondary-button" onClick={() => setJourneyView('inbox')} type="button">
                  Cancel
                </button>
              </div>
              <p className="field-hint">No reply is actually sent in this preview.</p>
            </section>
          </main>
        )
      }

      if (journeyView === 'resources') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card resources-card" aria-labelledby="resources-title">
              <header className="profile-topbar">
                <button className="back-button" onClick={() => setJourneyView('chat')} type="button">
                  <span aria-hidden="true">←</span> Chat
                </button>
                <span className="profile-brand">CATELINK</span>
              </header>
              <p className="eyebrow">Mentor view · only you see this · preview</p>
              <h1 className="profile-title" id="resources-title">
                Before you meet {profile.name.split(' ')[0] || 'your mentee'}
              </h1>
              <p className="profile-description">
                Their questions can help you prepare. These sample library resources are
                matched by topic; only you see suggestions unless you share one.
              </p>
              <section className="mentee-topics-card">
                <span className="field-label">What they want to cover</span>
                <div className="choice-list">
                  {promptTopics.length
                    ? promptTopics.map((topic) => <span className="choice-chip reason-chip" key={topic}>{topic}</span>)
                    : <span className="field-hint">No topics selected; showing general suggestions.</span>}
                </div>
                {promptText && <blockquote>{promptText}</blockquote>}
              </section>
              <h2 className="field-label resource-section-label">Suggested for you</h2>
              {filteredResources.length > 0 ? (
                <div className="resource-list">
                  {filteredResources.map((resource) => (
                    <article className="resource-card" key={resource.id}>
                      <span className="field-label">{resource.kind}</span>
                      <h2>{resource.title}</h2>
                      <p>Matched to: {resource.topic}</p>
                      <div className="choice-list">
                        <button
                          aria-pressed={resourceIdsUsed.includes(resource.id)}
                          className="choice-chip"
                          onClick={() => toggleResource(resource.id, 'use')}
                          type="button"
                        >
                          {resourceIdsUsed.includes(resource.id) ? 'Added to session' : 'Use in session'}
                        </button>
                        <button
                          aria-pressed={resourceIdsSent.includes(resource.id)}
                          className="choice-chip"
                          onClick={() => toggleResource(resource.id, 'send')}
                          type="button"
                        >
                          {resourceIdsSent.includes(resource.id) ? 'Sent to mentee' : 'Send to mentee'}
                        </button>
                        <button
                          className="choice-chip"
                          onClick={() => toggleResource(resource.id, 'hide')}
                          type="button"
                        >
                          Not relevant
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-resources">
                  <p>No sample resources match these topics yet.</p>
                  <button
                    className="secondary-button"
                    onClick={() => setResourceIdsHidden([])}
                    type="button"
                  >
                    Restore suggestions
                  </button>
                </div>
              )}
              <p className="field-hint">Resource titles and matches are illustrative, not an OFC library connection.</p>
              <button className="primary-button resource-back" onClick={() => setJourneyView('chat')} type="button">
                Back to chat
              </button>
            </section>
          </main>
        )
      }

      if (journeyView === 'video') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="video-card" aria-labelledby="video-title">
              <header className="chat-header">
                <button className="back-button" onClick={() => setJourneyView('chat')} type="button">
                  <span aria-hidden="true">←</span> Chat
                </button>
                <span className="profile-brand">CATELINK</span>
              </header>
              <p className="demo-disclaimer" role="note">
                Call preview only. No audio, video, or recording is connected.
              </p>
              <div className="video-remote">
                <span className={`mentor-avatar video-avatar tone-${selectedMentor?.tone ?? 0}`}>
                  {selectedMentor?.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </span>
                <h1 id="video-title">{selectedMentor?.name}</h1>
                <p>Call preview · {formatDuration(callSeconds)}</p>
                <span className="self-preview">{initials || 'You'}</span>
              </div>
              <div className="video-controls">
                <button
                  aria-pressed={videoMuted}
                  onClick={() => setVideoMuted((muted) => !muted)}
                  type="button"
                >
                  {videoMuted ? 'Unmute preview' : 'Mute preview'}
                </button>
                <button
                  aria-pressed={!videoCameraOn}
                  onClick={() => setVideoCameraOn((on) => !on)}
                  type="button"
                >
                  {videoCameraOn ? 'Turn camera preview off' : 'Turn camera preview on'}
                </button>
                <button className="end-call-button" onClick={endCall} type="button">
                  End call
                </button>
              </div>
              <section className="call-starters">
                <div className="starter-tabs" role="tablist" aria-label="Conversation starters">
                  {['Icebreaker', 'Pause and pray', 'Joy and struggle'].map((tab) => (
                    <button
                      aria-selected={callStarter === tab}
                      className={callStarter === tab ? 'starter-tab selected' : 'starter-tab'}
                      key={tab}
                      onClick={() => setCallStarter(tab)}
                      role="tab"
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {callStarter === 'Icebreaker' && (
                  <div className="starter-content">
                    <p>{ICEBREAKERS[icebreakerIndex]}</p>
                    <button
                      className="secondary-button"
                      onClick={() => setIcebreakerIndex((index) => (index + 1) % ICEBREAKERS.length)}
                      type="button"
                    >
                      Another question
                    </button>
                  </div>
                )}
                {callStarter === 'Pause and pray' && (
                  <div className="starter-content">
                    <p>Name one child you are carrying in prayer this week. Share it, then stay quiet together.</p>
                    <div className="prayer-controls">
                      <strong>{formatDuration(prayerSeconds)}</strong>
                      <button
                        className="secondary-button"
                        onClick={() => {
                          if (prayerSeconds === 0) {
                            setPrayerSeconds(60)
                            setPrayerRunning(true)
                            return
                          }
                          setPrayerRunning((running) => !running)
                        }}
                        type="button"
                      >
                        {prayerSeconds === 0 ? 'Reset one minute' : prayerRunning ? 'Pause' : 'Start one minute'}
                      </button>
                    </div>
                  </div>
                )}
                {callStarter === 'Joy and struggle' && (
                  <div className="starter-content joy-struggle">
                    <label>
                      One joy from this week
                      <textarea
                        onChange={(event) => setJoyNote(event.target.value)}
                        value={joyNote}
                      />
                    </label>
                    <label>
                      One struggle from this week
                      <textarea
                        onChange={(event) => setStruggleNote(event.target.value)}
                        value={struggleNote}
                      />
                    </label>
                    <p className="field-hint">Take turns. Listen first, then respond.</p>
                  </div>
                )}
              </section>
              {resourceIdsUsed.length > 0 && (
                <section className="call-resources">
                  <p className="field-label">Pinned for this session</p>
                  {RESOURCE_LIBRARY.filter((resource) => resourceIdsUsed.includes(resource.id)).map((resource) => (
                    <p key={resource.id}>{resource.title}</p>
                  ))}
                </section>
              )}
            </section>
          </main>
        )
      }

      if (journeyView === 'summary') {
        return (
          <main className="welcome-page profile-page journey-page">{themeToggle}
            <section className="profile-card summary-card" aria-labelledby="summary-title">
              <header className="profile-topbar">
                <button className="back-button" onClick={() => setJourneyView('video')} type="button">
                  <span aria-hidden="true">←</span> Call
                </button>
                <span className="profile-brand">CATELINK</span>
              </header>
              <p className="eyebrow">Session ended · preview</p>
              <h1 className="profile-title" id="summary-title">A note to take into next week</h1>
              <p className="profile-description">
                Write the shared summary together. It is only posted to this preview chat
                when you choose to share it.
              </p>
              <p className="demo-disclaimer" role="note">
                The summary uses only the notes you enter here. No call recording or automatic transcription.
              </p>
              <div className="profile-fields">
                <label className="profile-field">
                  <span className="field-label">What you covered</span>
                  <textarea
                    className="profile-input request-note"
                    onChange={(event) => setSessionNotes((current) => ({ ...current, covered: event.target.value }))}
                    placeholder="Main points from your conversation"
                    value={sessionNotes.covered}
                  />
                </label>
                <label className="profile-field">
                  <span className="field-label">To try this week</span>
                  <textarea
                    className="profile-input request-note"
                    onChange={(event) => setSessionNotes((current) => ({ ...current, tryThisWeek: event.target.value }))}
                    placeholder="One small thing to try"
                    value={sessionNotes.tryThisWeek}
                  />
                </label>
                <label className="profile-field">
                  <span className="field-label">Next session (optional)</span>
                  <input
                    className="profile-input"
                    onChange={(event) => setSessionNotes((current) => ({ ...current, nextSession: event.target.value }))}
                    placeholder="For example, Sat 24 Oct, 10:00"
                    value={sessionNotes.nextSession}
                  />
                </label>
              </div>
              <div className="completion-actions">
                <button className="primary-button" onClick={postSummary} type="button">
                  Post summary to chat
                </button>
                <button className="secondary-button" onClick={() => setJourneyView('chat')} type="button">
                  Keep private for now
                </button>
              </div>
            </section>
          </main>
        )
      }

      return (
        <main className="welcome-page profile-page">{themeToggle}
          <section className="profile-card completion-card" aria-labelledby="matched-title">
            <FishMark animated />
            <p className="eyebrow">Mentor match · demo</p>
            <h1 className="profile-title" id="matched-title">
              You and {selectedMentor?.name.split(' ')[0]} are matched
            </h1>
            <p className="profile-description">
              You both teach {selectedMentor?.groups.join(', ')}. {hasSharedAvailability
                ? 'You also have a usual meeting time in common.'
                : 'You do not have a usual meeting time in common yet.'}
              {' '}Start a conversation and choose a time to meet.
            </p>
            <button
              className="primary-button"
              onClick={openChat}
              type="button"
            >
              Say hello
            </button>
            <nav className="match-navigation" aria-label="Match navigation">
              <button className="text-button" onClick={() => setRequestStage(null)} type="button">
                Back to mentors
              </button>
              <button
                className="text-button"
                onClick={() => setJourneyView('inbox')}
                type="button"
              >
                Preview mentor inbox
              </button>
              <button
                className="text-button"
                onClick={() => {
                  setShowProfile(false)
                  setSelectedMentorId(null)
                  setRequestStage(null)
                  setJourneyView('match')
                }}
                type="button"
              >
                Return to welcome
              </button>
            </nav>
          </section>
        </main>
      )
    }

    if (requestStage === 'declined') {
      return (
        <main className="welcome-page profile-page">{themeToggle}
          <section className="profile-card" aria-labelledby="declined-title">
            <p className="eyebrow">A kind reply · demo</p>
            <h1 className="profile-title" id="declined-title">
              {selectedMentor?.name.split(' ')[0]} cannot take a new mentee right now
            </h1>
            <p className="profile-description">
              That is completely okay. Mentors serve on top of their own weekly classes.
              It says nothing about you, and there are no hard feelings.
            </p>
            <div className="profile-fields">
              <h2 className="field-label">Other mentors who fit you well</h2>
              {otherMatches.length > 0 ? (
                <div className="alternative-list">
                  {otherMatches.map((mentor) => (
                    <button
                      className="alternative-mentor"
                      key={mentor.id}
                      onClick={() => openAlternative(mentor.id)}
                      type="button"
                    >
                      <span className={`mentor-avatar tone-${mentor.tone}`}>
                        {mentor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                      </span>
                      <span className="alternative-copy">
                        <strong>{mentor.name}</strong>
                        <span>{mentor.parish} · {mentor.fit}% demo fit</span>
                      </span>
                      <span aria-hidden="true">›</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="field-hint">Clear a filter to see more mentor suggestions.</p>
              )}
            </div>
            <div className="completion-actions">
              <button className="primary-button" onClick={() => setRequestStage(null)} type="button">
                Back to mentors
              </button>
              <button className="secondary-button" onClick={() => setShowProfile(false)} type="button">
                Return to welcome
              </button>
            </div>
          </section>
        </main>
      )
    }

    if (requestStage === 'sent') {
      return (
        <main className="welcome-page profile-page">{themeToggle}
          <section className="profile-card" aria-labelledby="request-sent-title">
            <span className="completion-icon" aria-hidden="true">✓</span>
            <p className="eyebrow">Request sent · preview only</p>
            <h1 className="profile-title" id="request-sent-title">
              Your request is on its way to {selectedMentor?.name.split(' ')[0]}
            </h1>
            <p className="profile-description">
              In the finished app, the mentor can accept or decline and you will be
              notified. No request was sent from this preview.
            </p>
            <div className="prototype-panel">
              <span className="field-label">Preview a mentor reply</span>
              <button className="primary-button" onClick={() => setRequestStage('matched')} type="button">
                Mentor accepts
              </button>
              <button className="secondary-button" onClick={() => setRequestStage('declined')} type="button">
                Mentor declines
              </button>
            </div>
            <button className="text-button" onClick={() => setRequestStage(null)} type="button">
              Back to mentors
            </button>
          </section>
        </main>
      )
    }

    return (
      <main className="welcome-page profile-page discover-page">{themeToggle}
        <section className="discover-card" aria-labelledby="discover-title">
          <header className="discover-header">
            <button className="back-button" onClick={() => setComplete(false)} type="button">
              <span aria-hidden="true">←</span> Edit profile
            </button>
            <span className="profile-brand">CATELINK</span>
          </header>

          <p className="eyebrow">Your next step</p>
          <h1 className="profile-title" id="discover-title">Mentors for you</h1>
          <p className="profile-description">
            Matches are ranked by your learning goals, teaching context, experience, parish and shared availability. Select someone to see the reasons.
          </p>
          <p className="demo-disclaimer" role="note">
            Demo directory and fit scores only. No real mentor accounts are connected.
          </p>

          <div className="mentor-filters" aria-label="Filter mentors">
            <label>
              <span>Time</span>
              <select
                aria-label="Filter by time"
                onChange={(event) => setFilters((current) => ({ ...current, time: event.target.value }))}
                value={filters.time}
              >
                {['Any', ...MEETING_SLOTS].map((slot) => <option key={slot}>{slot}</option>)}
              </select>
            </label>
            <label>
              <span>Parish</span>
              <select
                aria-label="Filter by parish"
                onChange={(event) => setFilters((current) => ({ ...current, parish: event.target.value }))}
                value={filters.parish}
              >
                {['Any', ...PARISHES].map((parish) => <option key={parish}>{parish}</option>)}
              </select>
            </label>
            <label>
              <span>Area</span>
              <select
                aria-label="Filter by area"
                onChange={(event) => setFilters((current) => ({ ...current, area: event.target.value }))}
                value={filters.area}
              >
                {['Any', ...AREAS].map((area) => <option key={area}>{area}</option>)}
              </select>
            </label>
            {(filters.time !== 'Any' || filters.parish !== 'Any' || filters.area !== 'Any') && (
              <button
                className="clear-filters"
                onClick={() => setFilters(INITIAL_FILTERS)}
                type="button"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bubble-stage">
            <p className="bubble-count" role="status">
              {visibleMentors.length === 0
                ? 'No mentor fits all filters'
                : `${visibleMentors.length} ${visibleMentors.length === 1 ? 'mentor' : 'mentors'} fit you`}
            </p>
            {visibleMentors.length > 0 ? (
              <div className="mentor-bubbles" aria-label="Suggested mentors">
                {visibleMentors.map((mentor) => (
                  <button
                    aria-label={`${mentor.name}, ${getMentorFit(mentor, profile)}% demo fit`}
                    className={`mentor-bubble tone-${mentor.tone}`}
                    key={mentor.id}
                    onClick={() => openMentor(mentor.id)}
                    style={{
                      width: `${78 + (getMentorFit(mentor, profile) - 60) * 1.15}px`,
                      height: `${78 + (getMentorFit(mentor, profile) - 60) * 1.15}px`,
                    }}
                    type="button"
                  >
                    <span className="bubble-content">
                      <span className="bubble-initials">
                        {mentor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                      </span>
                      <span className="bubble-name">{mentor.name.split(' ')[0]}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-mentors">
                <p>Try clearing a filter to see other mentors.</p>
                <button className="secondary-button" onClick={() => setFilters(INITIAL_FILTERS)} type="button">
                  Reset mentor filters
                </button>
              </div>
            )}
          </div>

          <p className="fit-legend">Bubble size suggests fit · scores are example data</p>
          <button className="secondary-button discover-return" onClick={() => setShowProfile(false)} type="button">
            Return to welcome
          </button>
        </section>

        {selectedMentor && requestStage && (
          <div className="mentor-overlay">
            {requestStage === 'detail' ? (
              <section
                aria-labelledby="mentor-detail-title"
                aria-modal="true"
                className="mentor-sheet"
                role="dialog"
              >
                <button
                  aria-label="Close mentor details"
                  className="sheet-close"
                  onClick={() => setRequestStage(null)}
                  type="button"
                >
                  ×
                </button>
                <span className={`mentor-avatar tone-${selectedMentor.tone}`}>
                  {selectedMentor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </span>
                <p className="eyebrow">Suggested mentor</p>
                <h2 id="mentor-detail-title">{selectedMentor.name}</h2>
                <p className="mentor-location">{selectedMentor.parish} · {selectedMentor.area}</p>
                <p className="mentor-bio">{selectedMentor.bio}</p>
                <p>Teaches {selectedMentor.groups.join(', ')} like you</p>
                <div className="fit-summary">
                  <div className="fit-label"><span>Match score · demo</span><strong>{getMentorFit(selectedMentor, profile)}%</strong></div>
                  <div
                    aria-label={`${getMentorFit(selectedMentor, profile)}% example fit`}
                    className="fit-track"
                    role="img"
                  >
                    <span style={{ width: `${getMentorFit(selectedMentor, profile)}%` }} />
                  </div>
                </div>
                <dl className="mentor-facts">
                  <dt>Teaches</dt><dd>{selectedMentor.groups.join(', ')} · {selectedMentor.years} years</dd>
                  <dt>Expertise</dt><dd>{selectedMentor.expertise.join(', ')}</dd>
                  <dt>Meetings</dt><dd>{selectedMentor.meetingModes.join(', ')}</dd>
                  <dt>Style</dt><dd>{selectedMentor.styles.join(', ')}</dd>
                  <dt>Usually free</dt><dd>{selectedMentor.availability.join(', ')}</dd>
                </dl>
                <div className="match-reasons">
                  <span className="field-label">Why you may match</span>
                  <div className="choice-list">
                    {getMentorReasons(selectedMentor, profile).length > 0
                      ? getMentorReasons(selectedMentor, profile).map((reason) => (
                        <span className="choice-chip reason-chip" key={reason}>{reason}</span>
                      ))
                      : <span className="field-hint">A potential match to explore together.</span>}
                  </div>
                </div>
                <div className="sheet-actions">
                  <button className="secondary-button" onClick={() => setRequestStage(null)} type="button">
                    Back
                  </button>
                  <button className="primary-button" onClick={beginRequest} type="button">
                    Send request
                  </button>
                </div>
              </section>
            ) : (
              <section
                aria-labelledby="confirm-request-title"
                aria-modal="true"
                className="mentor-sheet"
                role="dialog"
              >
                <button
                  aria-label="Close request confirmation"
                  className="sheet-close"
                  onClick={() => setRequestStage('detail')}
                  type="button"
                >
                  ×
                </button>
                <p className="eyebrow">A first hello</p>
                <h2 id="confirm-request-title">
                  Send a request to {selectedMentor.name.split(' ')[0]}?
                </h2>
                <label className="profile-field">
                  <span className="field-label" id="request-note-label">A short note (optional)</span>
                  <textarea
                    aria-labelledby="request-note-label"
                    className="profile-input request-note"
                    onChange={(event) => setRequestNote(event.target.value)}
                    value={requestNote}
                  />
                </label>
                <p className="field-hint">
                  {selectedMentor.name.split(' ')[0]} can accept or decline. Either answer is fine.
                </p>
                <p className="demo-disclaimer">
                  Preview only. This button won’t send a real request.
                </p>
                <div className="sheet-actions">
                  <button className="secondary-button" onClick={() => setRequestStage('detail')} type="button">
                    Cancel
                  </button>
                  <button className="primary-button" onClick={sendRequest} type="button">
                    Preview sending request
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="welcome-page profile-page">{themeToggle}
      <section className="profile-card" aria-labelledby="profile-title">
        <header className="profile-topbar">
          <button className="back-button" onClick={goBack} type="button">
            <span aria-hidden="true">←</span> Back
          </button>
          <span className="profile-brand">CATELINK</span>
        </header>

        <ol className="step-indicator" aria-label="Profile setup progress">
          {[1, 2, 3].map((item) => (
            <li
              aria-current={item === step ? 'step' : undefined}
              className={item <= step ? 'step-active' : ''}
              key={item}
            >
              <span className="step-line" />
              <span className="step-label">Step {item}</span>
            </li>
          ))}
        </ol>

        <p className="eyebrow">Your profile · Step {step} of 3</p>
        <h1 className="profile-title" id="profile-title">
          {step === 1 && 'Let us start with you'}
          {step === 2 && 'How do you teach?'}
          {step === 3 && 'When can you meet?'}
        </h1>
        <p className="profile-description">
          {step === 1 && 'This is what a mentor or mentee sees first.'}
          {step === 2 && 'These answers help us suggest the right people.'}
          {step === 3 && 'Tap the times that usually work. You can change them later.'}
        </p>

        {step === 1 && (
          <div className="profile-fields">
            <div className="profile-person">
              <span className="avatar-placeholder" aria-label={`Initials: ${initials || 'You'}`}>
                {initials || 'You'}
              </span>
              <span className="field-hint">Your initials stand in for a photo for now.</span>
            </div>

            <div className="profile-field">
              <label className="field-label" htmlFor="profile-name">Full name</label>
              <input
                aria-describedby={error ? 'profile-error' : undefined}
                aria-invalid={Boolean(error)}
                autoComplete="name"
                className="profile-input"
                id="profile-name"
                onChange={(event) => updateProfile('name', event.target.value)}
                value={profile.name}
              />
            </div>

            <div className="profile-field">
              <label className="field-label" htmlFor="profile-parish">Parish</label>
              <input className="profile-input" id="profile-parish" list="singapore-parishes" onChange={(event) => updateProfile('parish', event.target.value)} value={profile.parish} />
              <datalist id="singapore-parishes">{PARISHES.map((parish) => <option key={parish} value={parish} />)}</datalist>
            </div>

            <ChoiceGroup
              label="I would like to"
              onSelect={(value) => updateProfile('intent', value)}
              options={['Find a mentor', 'Be a mentor', 'Both']}
              selected={profile.intent}
            />
          </div>
        )}

        {step === 2 && (
          <div className="profile-fields">
            <MultiChoiceGroup
              label="Group you teach"
              onToggle={(value) => toggleProfileList('groups', value)}
              options={TEACHING_GROUPS}
              selected={profile.groups}
            />

            <ChoiceGroup
              label="Seniority"
              onSelect={(value) => updateProfile('seniority', value)}
              options={['New', 'Mid-service', 'Veteran']}
              selected={profile.seniority}
            />

            <div className="profile-field">
              <label className="field-label" htmlFor="profile-years">Years of experience</label>
              <select
                className="profile-input"
                id="profile-years"
                onChange={(event) => updateProfile('years', event.target.value)}
                value={profile.years}
              >
                {['Under 1 year', '1 to 3 years', '4 to 9 years', '10 years or more'].map((years) => (
                  <option key={years}>{years}</option>
                ))}
              </select>
            </div>

            <div className="profile-field">
              <label className="field-label" htmlFor="profile-education">Education background</label>
              <select
                className="profile-input"
                id="profile-education"
                onChange={(event) => updateProfile('education', event.target.value)}
                value={profile.education}
              >
                {['Secondary', 'Diploma', 'Degree', 'Postgraduate', 'Theology or catechetical certificate'].map((education) => (
                  <option key={education}>{education}</option>
                ))}
              </select>
            </div>

            <MultiChoiceGroup
              hint={`${profile.learningNeeds.length} of 4 selected`}
              label="What would you like help with? (pick up to 4)"
              onToggle={(value) => toggleProfileList('learningNeeds', value)}
              options={LEARNING_NEEDS}
              selected={profile.learningNeeds}
            />

            <MultiChoiceGroup
              hint={`${profile.styles.length} of 3 selected`}
              label="Teaching style (pick up to 3)"
              onToggle={(value) => toggleProfileList('styles', value)}
              options={TEACHING_STYLES}
              selected={profile.styles}
            />
          </div>
        )}

        {step === 3 && (
          <div className="profile-fields">
            <div className="profile-field">
              <span className="field-label" id="availability-label">Usual availability</span>
              <div className="availability-grid" role="group" aria-labelledby="availability-label">
                <span aria-hidden="true" />
                {TIMES.map((time) => <span className="availability-heading" key={time}>{time}</span>)}
                {DAYS.map((day) => (
                  <div className="availability-row" key={day}>
                    <span className="availability-day">{day}s</span>
                    {TIMES.map((time) => {
                      const slot = `${day} ${time.toLowerCase()}`
                      const selected = profile.availability.includes(slot)
                      return (
                        <button
                          aria-label={`${slot}, ${selected ? 'free' : 'not selected'}`}
                          aria-pressed={selected}
                          className="availability-cell"
                          key={time}
                          onClick={() => toggleProfileList('availability', slot)}
                          type="button"
                        >
                          {selected ? 'Free' : '—'}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <ChoiceGroup
              label="Preferred way to meet"
              onSelect={(value) => updateProfile('meeting', value)}
              options={['Video', 'In person', 'Either']}
              selected={profile.meeting}
            />

            <ChoiceGroup
              label="Preferred mentor location"
              onSelect={(value) => updateProfile('location', value)}
              options={['Near my parish', 'Near my home', 'Anywhere in Singapore']}
              selected={profile.location}
            />
          </div>
        )}

        {error && <p className="profile-error" id="profile-error" role="alert">{error}</p>}

        <footer className="profile-actions">
          <button className="primary-button" onClick={continueProfile} type="button">
            {step === 3 ? 'Find my mentor' : 'Next'}
          </button>
        </footer>
      </section>
    </main>
  )
}

export default App
