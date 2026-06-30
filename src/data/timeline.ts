import { TimelineEvent } from '../types';

export const timelineData: TimelineEvent[] = [
  {
    id: 't-2015-election',
    date: '2015-03-28',
    title: 'Peaceful Democratic Transition',
    description:
      'Nigeria witnessed the first peaceful transfer of power between political parties in its history as Muhammadu Buhari defeated incumbent Goodluck Jonathan. This marked a watershed moment for Nigerian democracy.',
    type: 'geopolitical',
    analysis:
      'Sodiq described this as "democracy\'s finest hour" while cautioning that elite consensus, not institutional strength, was the primary driver. He predicted that without institutionalizing the norms that enabled this transition, the achievement would remain fragile.',
    prediction:
      'Sodiq predicted that the transition would create a window of reform opportunity that would close within 18 months if not seized, as the new administration would inevitably be captured by the same political and economic interests that sustained the previous government.',
    source: 'The Fourth Estate Podcast, April 2015',
  },
  {
    id: 't-2015-buhari-cabinet',
    date: '2015-11-11',
    title: 'Buhari Cabinet Formation',
    description:
      'President Buhari announced his cabinet six months after taking office, the longest delay in Nigerian history. The cabinet composition revealed the political bargaining that would define the administration.',
    type: 'analysis',
    analysis:
      'Sodiq analyzed the delay as evidence of intense intra-party bargaining rather than careful policy planning. He noted that the exclusion of key reform-minded figures signaled that the administration would prioritize political stability over institutional transformation.',
    source: 'Policy Brief: The Price of Delay, November 2015',
  },
  {
    id: 't-2016-recession',
    date: '2016-06-15',
    title: 'Nigeria Enters Technical Recession',
    description:
      'Nigeria\'s economy contracted for two consecutive quarters, driven by the collapse of global oil prices and policy missteps including foreign exchange restrictions.',
    type: 'geopolitical',
    analysis:
      'Sodiq argued that the recession was not primarily caused by external factors but by years of policy failure, including the failure to save during boom years, inconsistent economic signaling, and the maintenance of an archaic foreign exchange regime.',
    prediction:
      'He predicted that the recovery would be slow and that the government would resort to borrowing rather than structural reform, leading to a debt spiral that would constrain fiscal policy for a decade.',
    source: 'Economic Analysis Series, Q2 2016',
  },
  {
    id: 't-2017-anti-corruption',
    date: '2017-03-22',
    title: 'Anti-Corruption Campaign Intensifies',
    description:
      'The EFCC under Ibrahim Magu intensified high-profile corruption prosecutions, generating significant public support but also allegations of selective targeting.',
    type: 'institutional',
    status: 'ongoing',
    analysis:
      'Sodiq praised the increased enforcement activity but warned that anti-corruption efforts without judicial reform and asset declaration requirements would remain performative. He documented patterns of selective prosecution targeting political opponents while allies of the administration faced no scrutiny.',
    source: 'Accountability Monitor Report, Q1 2017',
  },
  {
    id: 't-2018-not-too-young',
    date: '2018-05-08',
    title: 'Not Too Young To Run Act Signed',
    description:
      'President Buhari signed the Not Too Young To Run Act, reducing the age of eligibility for president from 40 to 35 and for other offices proportionally, following sustained youth advocacy.',
    type: 'reform',
    status: 'completed',
    analysis:
      'Sodiq described this as "a victory of organized civic action over elite inertia," though he cautioned that lowering age barriers without addressing the financial barriers to political participation would limit the reform\'s impact.',
    prediction:
      'He predicted that the reform would produce a modest increase in young candidates but that the high cost of political participation would ensure that only economically privileged youth would benefit, potentially creating a new intra-generational divide.',
    source: 'Civic Action Analysis, May 2018',
  },
  {
    id: 't-2019-election',
    date: '2019-02-23',
    title: '2019 General Election',
    description:
      'The 2019 election saw President Buhari reelected amid widespread logistical failures, allegations of vote suppression, and violence in several states.',
    type: 'geopolitical',
    analysis:
      'Sodiq documented systematic failures including late arrival of electoral materials, malfunctioning card readers, and reports of voter intimidation. He characterized the election as a "democratic recession" — a retreat from the standards set in 2015.',
    prediction:
      'Sodiq warned that without comprehensive electoral reform — including independent funding for INEC, sanctions for electoral offenses, and transparent results transmission — 2023 would see even greater challenges.',
    source: 'Election Observation Report, March 2019',
  },
  {
    id: 't-2020-endsars',
    date: '2020-10-11',
    title: '#EndSARS Protests',
    description:
      'Nigerian youth led the largest coordinated protest movement in a generation, demanding the disbandment of the Special Anti-Robbery Squad (SARS) and broader police reform.',
    type: 'geopolitical',
    analysis:
      'Sodiq analyzed the #EndSARS movement as a watershed in Nigerian civic activism, noting that it demonstrated the organizational power of digital platforms while also revealing the state\'s willingness to use lethal force against protesters. He documented the Lekki toll gate massacre and its aftermath.',
    prediction:
      'He predicted that the government\'s failure to implement meaningful police reform would lead to cycles of outrage and suppression, and that the diaspora mobilization witnessed during #EndSARS would permanently transform Nigerian civil society into a transnational movement.',
    source: 'Civic Resilience in the Digital Age, October 2020',
  },
  {
    id: 't-2020-endsars-judicial',
    date: '2021-10-15',
    title: 'Lekki Judicial Panel Findings',
    description:
      'The Lagos State Judicial Panel of Inquiry submitted its report on the Lekki toll gate incident, documenting multiple fatalities and failures of command and control.',
    type: 'institutional',
    status: 'monitoring',
    analysis:
      'Sodiq noted that while the panel\'s findings were a victory for accountability-seeking, the government\'s failure to release the full report or prosecute those responsible demonstrated the limits of ad hoc accountability mechanisms.',
    source: 'Accountability Monitor Series, October 2021',
  },
  {
    id: 't-2021-燃油 subsidy',
    date: '2021-03-10',
    title: 'Fuel Subsidy Debate Intensifies',
    description:
      'The federal government announced plans to remove fuel subsidies, sparking intense debate about the timing, social protection mechanisms, and political viability of the reform.',
    type: 'analysis',
    analysis:
      'Sodiq argued that the subsidy debate exemplified Nigeria\'s policy paralysis: everyone acknowledged the subsidy was economically unsustainable, but successive governments lacked the political will and institutional capacity to implement compensatory social protection programs.',
    prediction:
      'He predicted that the government would announce and delay subsidy removal multiple times, ultimately being forced into a hasty removal by fiscal crisis rather than implementing a managed transition.',
    source: 'Economic Policy Analysis, Q1 2021',
  },
  {
    id: 't-2022-petroleum-act',
    date: '2022-08-16',
    title: 'Petroleum Industry Act Signed',
    description:
      'After two decades of legislative effort, the Petroleum Industry Act was signed, restructuring the Nigerian oil and gas sector.',
    type: 'reform',
    status: 'ongoing',
    analysis:
      'Sodiq characterized the PIA as "a necessary but insufficient reform," noting that while it addressed some governance issues in the petroleum sector, it did not address the fundamental structural problems of oil dependence, environmental degradation in the Niger Delta, or the lack of local refining capacity.',
    source: 'Policy Analysis: The PIA and Beyond, August 2022',
  },
  {
    id: 't-2023-election',
    date: '2023-02-25',
    title: '2023 Nigerian General Election',
    description:
      'The most contested election since the transition, featuring three major candidates and the first serious third-party challenge in decades. Bola Tinubu was declared winner amid widespread controversy.',
    type: 'geopolitical',
    analysis:
      'Sodiq provided real-time analysis of the election, documenting technical failures with the BVAS system, inconsistencies in results transmission, and the unprecedented role of social media in shaping voter perceptions. He described the election as "a stress test that revealed both democratic resilience and institutional fragility."',
    prediction:
      'He predicted a prolonged legal challenge, a decline in voter trust in electoral processes, and a need for fundamental electoral system reform including independent commission funding and robust results verification mechanisms.',
    source: 'Election Analysis Series, February-March 2023',
  },
  {
    id: 't-2023-supreme-court',
    date: '2023-10-26',
    title: 'Supreme Court Upholds Presidential Election',
    description:
      'The Supreme Court dismissed challenges to the 2023 presidential election, affirming Bola Tinubu\'s victory in a highly anticipated judgment.',
    type: 'institutional',
    status: 'monitoring',
    analysis:
      'Sodiq analyzed the judgment as revealing fundamental tensions within Nigerian jurisprudence between legal technicalities and substantive justice. He noted that the court\'s narrow reading of electoral technology requirements raised questions about the legal framework\'s ability to protect electoral integrity.',
    source: 'Legal Analysis: The Supreme Court and Electoral Justice, October 2023',
  },
  {
    id: 't-2024-subsidy-removal',
    date: '2024-05-29',
    title: 'Fuel Subsidy Removal and Economic Crisis',
    description:
      'The Tinubu administration removed the fuel subsidy on inauguration day, leading to a tripling of petrol prices and a cascading cost-of-living crisis.',
    type: 'geopolitical',
    analysis:
      'Sodiq analyzed the subsidy removal as economically necessary but politically catastrophic in its implementation. He documented the absence of compensatory social protection measures and the inflationary cascade that followed.',
    prediction:
      'He predicted that without a robust social protection framework and investment in public transportation and alternative energy, the subsidy removal would drive millions into poverty and fuel social unrest.',
    source: 'Economic Impact Assessment, Q2 2024',
  },
  {
    id: 't-2024-foreign-debt',
    date: '2024-09-15',
    title: 'Nigeria\'s Foreign Debt Service Exceeds Revenue',
    description:
      'Official figures revealed that Nigeria spent more on foreign debt servicing than on education, health, and infrastructure combined, triggering a national debate on fiscal sustainability.',
    type: 'institutional',
    status: 'monitoring',
    analysis:
      'Sodiq described this as "the fiscal reckoning that was predicted but not prepared for." He argued that the debt service-to-revenue ratio revealed the fundamental unsustainability of Nigeria\'s fiscal model and called for comprehensive tax reform and expenditure rationalization.',
    source: 'Fiscal Sustainability Monitor, Q3 2024',
  },
  {
    id: 't-2025-local-govt-autonomy',
    date: '2025-07-11',
    title: 'Supreme Court Grants Local Government Financial Autonomy',
    description:
      'In a landmark judgment, the Supreme Court ruled that local governments must receive and control their funds directly, ending decades of state government appropriation of local council funds.',
    type: 'reform',
    status: 'monitoring',
    analysis:
      'Sodiq hailed the judgment as "potentially the most consequential institutional reform since 1999," while cautioning that implementation would face fierce resistance from state governors who have grown accustomed to controlling local government funds.',
    prediction:
      'He predicted that state governments would employ various strategies to circumvent the judgment, including imposing new levies and creating parallel administrative structures, and that sustained civil society monitoring would be essential to ensure compliance.',
    source: 'Institutional Reform Analysis, July 2025',
  },
  {
    id: 't-2025-tax-reform',
    date: '2025-12-01',
    title: 'Comprehensive Tax Reform Bills Proposed',
    description:
      'The federal government submitted a set of comprehensive tax reform bills to the National Assembly, proposing simplification of the tax system and expansion of the tax base.',
    type: 'reform',
    status: 'proposed',
    analysis:
      'Sodiq noted that while the proposed reforms were technically sound, their political viability remained questionable given the strong opposition from state governors and traditional economic interests.',
    prediction:
      'He predicted that the bills would face significant legislative modification and that the final version would be substantially weaker than the original proposal, reflecting the political power of the interests that benefit from the current fragmented tax system.',
    source: 'Tax Policy Analysis, December 2025',
  },
];
