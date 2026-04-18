# Design Brief

## Direction

Industrial Factory Control Panel — A data-dense monitoring dashboard designed like a factory floor control system with authoritative dark surfaces and vibrant technical accents.

## Tone

Brutalist industrial precision executed with conviction: nearly black backgrounds with neon-bright accents (cyan, yellow, red, green). No soft pastels, no compromise.

## Differentiation

Real-time sensor values rendered in monospace against dark cards with subtle inner glow effects; status indicators, wear progress, and production metrics immediately scannable at a glance.

## Color Palette

| Token        | OKLCH             | Role                           |
| ------------ | ----------------- | ------------------------------ |
| background   | 0.12 0.01 280     | Nearly black base surface      |
| foreground   | 0.95 0.01 280     | Crisp white text, max contrast |
| card         | 0.18 0.015 280    | Secondary surface layer        |
| primary      | 0.7 0.22 265      | Cyan accent — primary actions  |
| accent       | 0.7 0.22 265      | Cyan — highlights              |
| warning      | 0.72 0.22 85      | Yellow — warning states        |
| destructive  | 0.55 0.22 25      | Red — critical alerts          |
| success      | 0.68 0.22 145     | Green — healthy status         |
| muted        | 0.22 0.02 280     | Secondary labels               |
| border       | 0.28 0.02 280     | Subtle dividers                |

## Typography

- Display: Space Grotesk — geometric, technical headings and metrics
- Body: DM Sans — clean labels, UI text, excellent legibility
- Mono: Geist Mono — sensor values, real-time data
- Scale: Hero `text-4xl md:text-5xl font-bold tracking-tight`, H2 `text-2xl md:text-3xl font-bold`, Label `text-xs font-semibold uppercase tracking-widest`, Body `text-sm md:text-base`

## Elevation & Depth

Two-layer card system: base cards (`bg-card shadow-card-flat`) for content, elevated cards (`shadow-card-elevated`) for interactive elements. No soft shadows — crisp 1px borders with subtle inset highlights.

## Structural Zones

| Zone    | Background      | Border                 | Notes                            |
| ------- | --------------- | ---------------------- | -------------------------------- |
| Header  | `bg-card`       | `border-b border-border` | Dark slate with logo, navigation |
| Content | `bg-background` | —                      | Alternating `bg-card` sections   |
| KPI Grid| `bg-card`       | `border border-border`   | 4-column card layout, cyan text  |
| Alerts  | `bg-card`       | `border-t border-border` | Timestamp + color-coded badges   |

## Spacing & Rhythm

Content grid with 24px base unit: sections separated by 2rem, cards nested within at 1rem padding, microspacing 0.5rem. Compact density — information-first, breathing room secondary.

## Component Patterns

- Buttons: Cyan background (`bg-primary`), hover inverts to dark with cyan outline, monospace labels
- Cards: Subtle inset border (`shadow-card-flat`), dark background with `0.5px solid` light border, no rounded corners
- Badges: Inline-flex with color-coded background (cyan/yellow/red/green), white text, `text-xs font-semibold`
- Status Indicators: `h-2 w-2 rounded-full`, color-coded with `status-glow` effect

## Motion

- Data refresh: `animate-data-refresh` (0.4s scale pulse) when sensor values update
- Hover: All interactive elements use `transition-smooth` (0.3s cubic-bezier)
- Entrance: Cards fade and slide up on mount (orchestrated via React)
- Decorative: Gentle pulsing on live status indicators (`animate-pulse-gentle`)

## Constraints

- No rounded corners on cards (industrial aesthetic)
- All colors OKLCH-based, never hex literals
- Monospace values for all sensor readings and timestamps
- Cyan accent used sparingly for primary CTAs only
- Yellow/Red/Green reserved for state signals, not decoration

## Signature Detail

Cyan accent glow on status indicators and critical metrics, creating a "live monitor" visual metaphor that reinforces real-time data flow and industrial control room authenticity.
