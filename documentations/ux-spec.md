# UX Specification

## 1. Purpose
Describe what problem the app solves and the primary value it delivers.

## 2. Goals & Success Metrics
| Goal | KPI | Target |
|------|-----|--------|
| Onboard users quickly | Time to first key action | < 2 min |
| Retain users | D7 retention | ≥ 40 % |
| ... | ... | ... |

## 3. Target Personas
| Persona | Needs | Pain Points |
|---------|-------|-------------|
| Primary User | *e.g.*, monitor seismic data | Complex dashboards |
| Secondary User | ... | ... |

## 4. User Journey (Happy Path)
1. Discover app →  
2. Sign in/Sign up →  
3. Configure data source →  
4. View real-time pulse feed →  
5. Set alerts →  
6. Share insights →

## 5. Information Architecture
```
Home
 ├─ Dashboard
 │   ├─ Overview
 │   ├─ Real-time Feed
 │   └─ Alerts
 ├─ Data Sources
 ├─ Reports
 ├─ Settings
 └─ Help
```

## 6. Key Screens & States
| Screen | Primary Actions | Empty State |
|--------|-----------------|-------------|
| Dashboard | Filter, Drill-down | “Add a data source” |
| Feed | Pause, Export | “No data yet” |

## 7. Interaction Design
* Consistent top-nav, context-aware side panel.  
* Inline validation on all forms.  
* Undo available for destructive actions (5 s toast).  

## 8. Visual Design
* Color: Microsoft Fluent palette; alerts use `#D13438`.  
* Typography: Segoe UI, 14 px base.  
* Spacing: 8 pt grid.  

## 9. Accessibility
* WCAG 2.2 AA.  
* Keyboard focus order matches DOM.  
* ARIA roles on live data regions.  

## 10. Non-Functional Requirements
| Aspect | Spec |
|--------|------|
| Performance | P95 ≤ 200 ms render |
| Responsiveness | Mobile ≥ 375 px |
| Localization | EN, ES in v1 |

## 11. Open Issues
1. Multi-tenant data separation.
2. Offline mode feasibility.

## 12. Acceptance Criteria
- [ ] User can connect a data source without errors.
- [ ] Real-time feed refreshes ≤ 1 s.
- [ ] Alert triggers send push notification.

*Last updated:* 2024-06-17


# Geographic mode
- World map with proper projection with co-ordinate
- 