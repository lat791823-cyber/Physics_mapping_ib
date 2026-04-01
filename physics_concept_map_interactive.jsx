import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STAGES = [
  "Definitions",
  "Laws",
  "Derivations",
  "Applications",
  "Limits & Extensions",
];

const DOMAINS = [
  "Mechanics",
  "Fields & Electricity",
  "Waves & Modern",
  "Thermal",
];

const stageX = {
  Definitions: 180,
  Laws: 440,
  Derivations: 700,
  Applications: 960,
  "Limits & Extensions": 1220,
};

const domainY = {
  Mechanics: 150,
  "Fields & Electricity": 400,
  "Waves & Modern": 650,
  Thermal: 900,
};

function pos(stage, domain, slot = 0) {
  return {
    x: stageX[stage],
    y: domainY[domain] + slot * 78,
  };
}

const nodes = [
  // Mechanics
  {
    id: "motiondefs",
    label: "Motion Variables",
    kind: "definition",
    stage: "Definitions",
    domain: "Mechanics",
    level: "IB Core",
    slot: 0,
    formula: "v = dx/dt   ;   a = dv/dt",
    summary: "Position, velocity, and acceleration are the fundamental descriptors of motion.",
    details:
      "At IB level these are often handled with average rates and constant-acceleration formulas. At university level they become exact derivative definitions.",
    units: ["x: m", "v: m s⁻¹", "a: m s⁻²"],
    assumptions: ["A chosen reference frame exists.", "Time is treated as a continuous variable in bridge-level calculus."],
    commonMistakes: [
      "Confusing speed with velocity.",
      "Treating acceleration as 'speeding up' only; it can also mean changing direction or slowing down.",
    ],
    ibUse: ["Constant-acceleration motion", "Graph interpretation", "Projectile motion setup"],
    enabling: [
      "Motion can be measured relative to a frame.",
      "Rates of change link one motion variable to the next.",
    ],
  },
  {
    id: "momentumdef",
    label: "Momentum",
    kind: "definition",
    stage: "Definitions",
    domain: "Mechanics",
    level: "IB Core",
    slot: 1,
    formula: "p = mv",
    summary: "Momentum is the translational quantity of motion and becomes central in collisions and quantum bridges.",
    details:
      "Momentum is often more fundamental than force because many laws are most naturally written in terms of how momentum changes.",
    units: ["kg m s⁻¹", "equivalently N s"],
    assumptions: ["Classical form shown here; relativistic corrections appear at high speed."],
    commonMistakes: ["Forgetting direction/sign.", "Using momentum conservation when external impulse is not negligible."],
    ibUse: ["Collisions", "Impulse questions", "de Broglie wavelength bridge"],
    enabling: ["Mass and velocity together capture motion in a conserved form when the system is isolated."],
    bridgeNote:
      "University bridge: momentum later becomes the generator of translations and an operator in quantum mechanics.",
  },
  {
    id: "newton2",
    label: "Newton's 2nd Law",
    kind: "law",
    stage: "Laws",
    domain: "Mechanics",
    level: "IB Core",
    slot: 0,
    formula: "F = dp/dt   ;   if m constant, F = ma",
    summary: "The fundamental law connecting interaction to motion change.",
    details:
      "The momentum form is the general version. The F = ma form hides the constant-mass assumption.",
    derivation: [
      "Start from momentum p = mv.",
      "Differentiate with respect to time: dp/dt = d(mv)/dt.",
      "For constant mass, dp/dt = m dv/dt.",
      "Since a = dv/dt, then dp/dt = ma.",
      "Newton's 2nd law states F = dp/dt, so F = ma in the constant-mass case.",
    ],
    enabling: [
      "Derivative language converts a quantity into its local change rule.",
      "Mass must be treated as constant to recover F = ma.",
    ],
    units: ["F: N = kg m s⁻²"],
    assumptions: ["Inertial frame", "Constant mass for the F = ma form"],
    commonMistakes: ["Using F = ma automatically even when momentum form is cleaner.", "Adding forces as scalars instead of vectors."],
    ibUse: ["Free-body diagrams", "Circular motion", "SHM bridge", "Dynamics on inclines"],
    bridgeNote:
      "University bridge: this law becomes much more powerful once combined with calculus and coordinate decomposition.",
  },
  {
    id: "workenergy",
    label: "Work-Energy Theorem",
    kind: "law",
    stage: "Laws",
    domain: "Mechanics",
    level: "IB Core",
    slot: 1,
    formula: "W_net = ΔK",
    summary: "Net work changes kinetic energy.",
    details:
      "This is often the fastest route through motion problems when the path matters more than time.",
    derivation: [
      "Begin with dW = F dx.",
      "Use F = ma.",
      "Apply the chain rule: a = dv/dt = v dv/dx.",
      "Then dW = m(v dv/dx)dx = m v dv.",
      "Integrate to obtain W = 1/2 mv² - 1/2 mu² = ΔK.",
    ],
    enabling: [
      "Work is force acting through displacement.",
      "The chain rule converts time-based dynamics into displacement-based accumulation.",
    ],
    units: ["J = N m = kg m² s⁻²"],
    assumptions: ["Classical kinetic energy", "Constant mass"],
    commonMistakes: ["Using only energy conservation when non-conservative work is present.", "Dropping sign conventions for work."],
    ibUse: ["Roller-coaster style problems", "Escape speed derivations", "Comparing force and energy methods"],
  },
  {
    id: "impulse",
    label: "Impulse",
    kind: "derivation",
    stage: "Derivations",
    domain: "Mechanics",
    level: "IB Core",
    slot: 0,
    formula: "J = Δp = ∫F dt   ;   constant F → FΔt",
    summary: "Impulse is the integrated effect of force over time.",
    details:
      "This is the cleanest example of a derivative law becoming a useful formula by integration.",
    derivation: [
      "Start with F = dp/dt.",
      "Rearrange: dp = F dt.",
      "Integrate over the interaction interval.",
      "This gives ∫dp = ∫F dt, so Δp = ∫F dt.",
      "If force is constant, Δp = FΔt.",
    ],
    enabling: ["Integration accumulates many tiny momentum changes.", "Area under a force-time graph gives total change."],
    units: ["N s = kg m s⁻¹"],
    assumptions: ["The time interval and net force are defined consistently."],
    commonMistakes: ["Using one force instead of net force.", "Ignoring direction in one-dimensional collisions."],
    ibUse: ["Force-time graphs", "Crash safety reasoning", "Collision analysis"],
  },
  {
    id: "suvat",
    label: "SUVAT from Calculus",
    kind: "derivation",
    stage: "Derivations",
    domain: "Mechanics",
    level: "University Bridge",
    slot: 1,
    formula: "v = u + at   ;   s = ut + 1/2 at²   ;   v² = u² + 2as",
    summary: "The standard constant-acceleration equations can be derived rather than memorized once calculus is available.",
    details:
      "This node turns a memorization-heavy IB cluster into a small family of consequences from the definition of acceleration.",
    derivation: [
      "Assume constant acceleration a = dv/dt.",
      "Integrate from u to v over time 0 to t: v = u + at.",
      "Since v = ds/dt = u + at, integrate again: s = ut + 1/2 at².",
      "Use a = dv/dt and write a = v dv/ds.",
      "Integrate to obtain v² = u² + 2as.",
    ],
    enabling: [
      "Constant acceleration makes the integrals simple.",
      "Chain rule allows a = v dv/ds.",
      "Definitions of velocity and acceleration are sufficient to generate the family.",
    ],
    units: ["u,v: m s⁻¹", "a: m s⁻²", "s: m"],
    assumptions: ["Acceleration is constant over the interval."],
    commonMistakes: ["Applying SUVAT when acceleration is not constant.", "Mixing vector components in 2D motion."],
    ibUse: ["Projectile components", "Vertical motion", "Derivation-heavy extension answers"],
    bridgeNote:
      "This is one of the cleanest examples of recommendation #2: definitions → law/assumption → derivation → application.",
  },
  {
    id: "projectile",
    label: "Projectile Motion",
    kind: "application",
    stage: "Applications",
    domain: "Mechanics",
    level: "IB Core",
    slot: 0,
    formula: "x = (u cosθ)t   ;   y = (u sinθ)t - 1/2 gt²",
    summary: "A direct application of constant-acceleration motion in two independent directions.",
    details:
      "Projectile motion shows why vector decomposition matters: horizontal and vertical motions share time but not the same acceleration.",
    units: ["m", "s", "m s⁻¹"],
    assumptions: ["Uniform g", "No air resistance"],
    commonMistakes: ["Using one SUVAT equation without separating x and y.", "Forgetting horizontal acceleration is zero."],
    ibUse: ["Range, maximum height, time of flight"],
  },
  {
    id: "escape",
    label: "Escape Velocity",
    kind: "application",
    stage: "Applications",
    domain: "Mechanics",
    level: "University Bridge",
    slot: 1,
    formula: "v_e = √(2GM/r)",
    summary: "The minimum launch speed needed so an object reaches infinity with zero remaining kinetic energy.",
    details:
      "This is the classic application of the work-energy / energy-conservation route in a varying gravitational field.",
    derivation: [
      "Set final kinetic and potential energy at infinity to zero.",
      "Use total energy conservation: 1/2 mv² - GMm/r = 0.",
      "Solve for v.",
      "This gives v = √(2GM/r).",
    ],
    enabling: [
      "Gravity is modeled with a radial potential U = -GMm/r.",
      "Escape is defined as reaching infinity with no leftover kinetic energy.",
    ],
    units: ["m s⁻¹"],
    assumptions: ["No atmospheric drag", "No propulsion after launch", "Spherically symmetric mass source"],
    commonMistakes: ["Using mgh instead of -GMm/r for large-scale problems.", "Thinking escape requires continuous force rather than sufficient initial energy."],
    ibUse: ["Gravitational potential energy extension", "Energy comparison questions"],
  },
  {
    id: "relativity",
    label: "Relativity",
    kind: "limit",
    stage: "Limits & Extensions",
    domain: "Mechanics",
    level: "University Bridge",
    slot: 0,
    formula: "classical p = mv breaks down near c",
    summary: "Classical mechanics is a low-speed approximation.",
    details:
      "This node reminds the map that many formulas are not universal truths but domain-limited models.",
    assumptions: ["Applies when speeds are not negligible compared with c."],
    commonMistakes: ["Using classical momentum or energy too close to relativistic regimes."],
    ibUse: ["Nature of scientific models", "Why approximations matter"],
    enabling: ["Formulas have domains of validity, not unlimited scope."],
  },

  // Fields & Electricity
  {
    id: "fielddefs",
    label: "Field & Potential",
    kind: "definition",
    stage: "Definitions",
    domain: "Fields & Electricity",
    level: "IB Core",
    slot: 0,
    formula: "g = F/m   ;   E = F/q   ;   V = U/q",
    summary: "Fields describe local influence; potential describes the energy landscape per unit property.",
    details:
      "Field is a local 'push per unit source'. Potential is a stored-energy viewpoint. Together they are one of the most important conceptual pairs in physics.",
    units: ["g: N kg⁻¹", "E: N C⁻¹ or V m⁻¹", "V: J C⁻¹"],
    assumptions: ["A suitable test mass or test charge can probe the field without strongly disturbing it."],
    commonMistakes: ["Confusing field with potential.", "Mixing total potential energy U with potential V."],
    ibUse: ["Electric field problems", "Potential difference", "Gravitational analogies"],
    enabling: ["A global landscape description and a local force description can coexist for the same interaction."],
  },
  {
    id: "circuitdefs",
    label: "Charge, Current, Voltage",
    kind: "definition",
    stage: "Definitions",
    domain: "Fields & Electricity",
    level: "IB Core",
    slot: 1,
    formula: "I = dQ/dt   ;   V = W/Q",
    summary: "Current measures charge flow rate; voltage measures energy transferred per unit charge.",
    details:
      "These definitions make circuit equations far more meaningful than treating them as symbol matching.",
    units: ["Q: C", "I: A = C s⁻¹", "V: J C⁻¹"],
    assumptions: ["Charge flow can be modeled continuously in circuit-scale problems."],
    commonMistakes: ["Treating current as 'used up'.", "Confusing energy with voltage."],
    ibUse: ["Kirchhoff reasoning", "Power calculations", "Capacitor interpretation"],
    enabling: ["Flow rate and energy-per-unit ideas let circuits be analyzed systematically."],
  },
  {
    id: "fieldpotentiallaw",
    label: "Field–Potential Relation",
    kind: "law",
    stage: "Laws",
    domain: "Fields & Electricity",
    level: "University Bridge",
    slot: 0,
    formula: "E = -dV/dx   ;   vector form: E = -∇V",
    summary: "Field points in the direction of the steepest decrease in potential.",
    details:
      "This is the calculus bridge between local force descriptions and energy-landscape descriptions.",
    derivation: [
      "Start with V = U/q.",
      "Use F = -dU/dx for conservative forces.",
      "Divide by q: E = F/q = -(1/q)dU/dx.",
      "Since U = qV, then dU/dx = q dV/dx.",
      "So E = -dV/dx.",
    ],
    enabling: [
      "Potential is energy per unit charge.",
      "Conservative forces permit a potential function.",
      "Derivatives turn a landscape into a local slope.",
    ],
    units: ["V m⁻¹ = N C⁻¹"],
    assumptions: ["Electrostatic situation / conservative field in the intended use."],
    commonMistakes: ["Dropping the negative sign.", "Confusing total potential with potential difference."],
    ibUse: ["Potential gradient reasoning", "Field from graph slope"],
  },
  {
    id: "magneticforce",
    label: "Magnetic Force",
    kind: "law",
    stage: "Laws",
    domain: "Fields & Electricity",
    level: "IB Core",
    slot: 1,
    formula: "F = qvB sinθ   ;   on wire: F = BIL sinθ",
    summary: "Magnetic force acts on moving charges or currents and is perpendicular to the motion/current and field.",
    details:
      "This law matters because it changes direction of motion without necessarily changing speed, making it conceptually different from many electric-field situations.",
    units: ["B: T", "F: N"],
    assumptions: ["Velocity/current and magnetic field are defined at the same region in space."],
    commonMistakes: ["Using magnetic force to do work in the simple perpendicular case.", "Forgetting the sine term / angle."],
    ibUse: ["Particle paths", "Motor effect", "Right-hand-rule questions"],
    enabling: ["A force can redirect motion without changing kinetic energy when always perpendicular to velocity."],
  },
  {
    id: "potentialenergy",
    label: "Potential Energy from Force",
    kind: "derivation",
    stage: "Derivations",
    domain: "Fields & Electricity",
    level: "University Bridge",
    slot: 0,
    formula: "F = -dU/dx",
    summary: "Potential energy is the energy-side encoding of a conservative force.",
    details:
      "This node upgrades separate memorized formulas like mgh into a more general structural idea.",
    derivation: [
      "Define infinitesimal work by the force: dW = F dx.",
      "For a conservative force, define potential energy so dU = -dW.",
      "Then dU = -F dx.",
      "Rearrange to get F = -dU/dx.",
    ],
    enabling: ["Conservative forces allow path-independent energy bookkeeping.", "The negative sign means force points toward lower potential energy."],
    units: ["U: J", "dU/dx: N"],
    assumptions: ["Conservative force"],
    commonMistakes: ["Applying a potential-energy method to non-conservative situations without extra work terms."],
    ibUse: ["Gravitational and electric potential energy reasoning"],
  },
  {
    id: "capacitors",
    label: "Capacitors",
    kind: "derivation",
    stage: "Derivations",
    domain: "Fields & Electricity",
    level: "IB Core",
    slot: 1,
    formula: "C = Q/V   ;   U = 1/2 CV² = 1/2 QV = Q²/(2C)",
    summary: "Capacitors store energy in an electric field, and their energy formula follows from building up charge gradually.",
    details:
      "This is a perfect IB-plus bridge derivation because the result is standard, but the reason for the factor 1/2 is often poorly understood.",
    derivation: [
      "At an intermediate charge q, the capacitor voltage is v = q/C.",
      "Small work to add dq is dW = v dq = (q/C)dq.",
      "Integrate from 0 to Q: W = ∫(q/C)dq.",
      "This gives W = Q²/(2C).",
      "Using V = Q/C, rewrite as U = 1/2 QV = 1/2 CV².",
    ],
    enabling: [
      "The voltage is not constant while the capacitor charges.",
      "Integration is needed because each extra bit of charge is added against a changing potential.",
    ],
    units: ["C: F", "U: J"],
    assumptions: ["Ideal capacitor model"],
    commonMistakes: ["Using U = QV instead of 1/2 QV for stored energy.", "Forgetting that voltage changes during charging."],
    ibUse: ["Energy storage", "RC-style conceptual links", "Graph interpretation"],
  },
  {
    id: "circuits",
    label: "Circuit Analysis",
    kind: "application",
    stage: "Applications",
    domain: "Fields & Electricity",
    level: "IB Core",
    slot: 0,
    formula: "V = IR   ;   P = IV = I²R = V²/R",
    summary: "Circuits operationalize charge flow and energy transfer in components.",
    details:
      "This is where definitions of current and voltage become concrete and testable.",
    units: ["P: W", "R: Ω"],
    assumptions: ["Ideal component laws when using simple textbook formulas"],
    commonMistakes: ["Thinking charge is used up.", "Mixing series and parallel rules."],
    ibUse: ["Kirchhoff-type reasoning", "Power calculations", "Resistor networks"],
  },
  {
    id: "gauss",
    label: "Gauss's Law",
    kind: "limit",
    stage: "Limits & Extensions",
    domain: "Fields & Electricity",
    level: "University Bridge",
    slot: 0,
    formula: "∮ E·dA = Q_enclosed/ε₀",
    summary: "A symmetry-powered extension that connects flux through a closed surface to enclosed charge.",
    details:
      "This is a major first-year university upgrade because it replaces many point-by-point force calculations with global symmetry reasoning.",
    units: ["N m² C⁻¹ for electric flux"],
    assumptions: ["Best used with high symmetry for efficient calculation"],
    commonMistakes: ["Trying to use Gauss's law for a direct field magnitude without enough symmetry.", "Confusing enclosed charge with all nearby charge."],
    ibUse: ["Extension beyond IB", "Explaining why symmetry matters"],
    enabling: ["Global surface information can sometimes replace local field computation when symmetry constrains the answer."],
  },

  // Waves & Modern
  {
    id: "wavedefs",
    label: "Wave Quantities",
    kind: "definition",
    stage: "Definitions",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 0,
    formula: "f = 1/T   ;   λ = distance per cycle",
    summary: "Frequency, period, wavelength, and amplitude structure wave analysis.",
    details:
      "Most wave relations are combinations of these definitions plus superposition ideas.",
    units: ["f: Hz", "T: s", "λ: m"],
    assumptions: ["A repeating disturbance can be meaningfully identified cycle-to-cycle."],
    commonMistakes: ["Confusing amplitude with wavelength.", "Mixing wave speed and particle speed in mechanical waves."],
    ibUse: ["Wave speed calculations", "Graph reading", "Interference setup"],
    enabling: ["Periodicity lets geometry and timing connect."],
  },
  {
    id: "quantumdefs",
    label: "Wave–Particle Bridge",
    kind: "definition",
    stage: "Definitions",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 1,
    formula: "light and matter can require both wave and particle descriptions",
    summary: "Classical categories split apart in the microscopic world.",
    details:
      "This is not a formula node so much as the conceptual doorway to de Broglie, photoelectricity, and quantum mechanics.",
    assumptions: ["Microscopic behavior may violate classical intuition."],
    commonMistakes: ["Thinking wave and particle pictures must both apply classically at the same time in the same way."],
    ibUse: ["Model discussion", "Nature of science answers"],
    enabling: ["Observed phenomena force a broader model language than classical mechanics alone."],
  },
  {
    id: "waverelation",
    label: "Wave Relation",
    kind: "law",
    stage: "Laws",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 0,
    formula: "v = fλ",
    summary: "Wave speed equals frequency times wavelength.",
    details:
      "This is a definition-level law: it follows from what one cycle means in distance and time.",
    derivation: [
      "In one period T, the wave advances by one wavelength λ.",
      "Speed is distance over time, so v = λ/T.",
      "Since f = 1/T, substitute to obtain v = fλ.",
    ],
    enabling: ["Wavelength is distance per cycle.", "Period is time per cycle."],
    units: ["m s⁻¹"],
    assumptions: ["Stable repeating wave pattern"],
    commonMistakes: ["Thinking changing frequency changes speed in a medium automatically."],
    ibUse: ["Sound and light wave calculations", "Changing medium questions"],
  },
  {
    id: "debroglie",
    label: "de Broglie Relation",
    kind: "law",
    stage: "Laws",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 1,
    formula: "λ = h/p",
    summary: "Matter with momentum can be associated with wavelength.",
    details:
      "This is the main conceptual bridge from mechanics into quantum theory.",
    derivation: [
      "For photons, combine E = hf with p = E/c.",
      "This gives p = hf/c.",
      "Use c = fλ, so p = h/λ.",
      "de Broglie generalized the momentum–wavelength relation to matter.",
    ],
    enabling: ["Light already exhibited dual behavior.", "Momentum is the right translational quantity to link to wavelength."],
    units: ["λ: m"],
    assumptions: ["Classical momentum may need relativistic correction at high speed."],
    commonMistakes: ["Using λ = h/mv blindly when relativistic momentum is required."],
    ibUse: ["Electron wavelength", "Comparing particle speeds and wavelengths"],
  },
  {
    id: "standingwaves",
    label: "Standing Waves",
    kind: "derivation",
    stage: "Derivations",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 0,
    formula: "L = nλ/2   (string/open-open)   ;   L = (2n-1)λ/4   (open-closed)",
    summary: "Standing-wave formulas arise from boundary conditions plus interference.",
    details:
      "This is one of the best examples of 'application via constraint': the medium only allows patterns that fit its boundaries.",
    derivation: [
      "A standing wave forms from interference of opposite-traveling waves.",
      "Fixed ends require nodes at the boundaries.",
      "That means the length must contain an integer number of half-wavelengths.",
      "So L = nλ/2 for strings or pipes with equivalent boundary conditions.",
    ],
    enabling: ["Boundary conditions restrict allowable patterns.", "Superposition creates nodes and antinodes."],
    units: ["L, λ: m"],
    assumptions: ["Stable resonance", "Idealized boundary conditions"],
    commonMistakes: ["Using the wrong boundary-condition formula.", "Mixing node spacing with wavelength."],
    ibUse: ["Strings, pipes, harmonics, resonance"],
  },
  {
    id: "shm",
    label: "SHM from Restoring Force",
    kind: "derivation",
    stage: "Derivations",
    domain: "Waves & Modern",
    level: "University Bridge",
    slot: 1,
    formula: "a = -ω²x   ;   for spring ω = √(k/m)",
    summary: "Simple harmonic motion comes from a restoring influence proportional to displacement.",
    details:
      "This is a major bridge node because it connects force laws, oscillation, and differential equations.",
    derivation: [
      "Start with Hooke's law F = -kx.",
      "Apply Newton's 2nd law: ma = -kx.",
      "Rearrange: a = -(k/m)x.",
      "Define ω² = k/m, giving a = -ω²x.",
      "Solving the differential equation yields sinusoidal motion.",
    ],
    enabling: ["A linear restoring force is the core physical assumption.", "The negative sign ensures return toward equilibrium."],
    units: ["ω: rad s⁻¹"],
    assumptions: ["Small enough displacement for linear restoring behavior"],
    commonMistakes: ["Calling any oscillation SHM.", "Missing that SHM is defined by the restoring law, not just by 'back-and-forth motion'."],
    ibUse: ["Spring-mass systems", "Oscillation graphs", "Wave-oscillator connection"],
  },
  {
    id: "interference",
    label: "Interference & Diffraction",
    kind: "application",
    stage: "Applications",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 0,
    formula: "path difference controls bright/dark outcomes",
    summary: "Wave overlap produces reinforcement and cancellation patterns.",
    details:
      "This node links pure wave ideas to experimental evidence for matter waves.",
    assumptions: ["Coherent sources in the intended idealized treatment"],
    commonMistakes: ["Forgetting that phase/path difference matters, not just amplitude."],
    ibUse: ["Double slit", "Thin-film / qualitative interference", "Experimental interpretation"],
    enabling: ["Superposition adds disturbances point by point."],
  },
  {
    id: "photoelectric",
    label: "Photoelectric Effect",
    kind: "application",
    stage: "Applications",
    domain: "Waves & Modern",
    level: "IB Core",
    slot: 1,
    formula: "hf = ϕ + K_max",
    summary: "Electron emission demonstrates that light energy arrives in quanta.",
    details:
      "This is one of the decisive applications of the photon model and a key bridge away from purely classical wave thinking.",
    units: ["J or eV"],
    assumptions: ["One-photon-one-electron idealized interpretation"],
    commonMistakes: ["Thinking higher intensity always increases max kinetic energy.", "Ignoring threshold frequency."],
    ibUse: ["Stopping potential", "Threshold discussion", "Evidence for photons"],
    enabling: ["A single interaction must provide enough energy to overcome the work function."],
  },
  {
    id: "schrodinger",
    label: "Schrödinger Bridge",
    kind: "limit",
    stage: "Limits & Extensions",
    domain: "Waves & Modern",
    level: "University Bridge",
    slot: 0,
    formula: "-(ħ²/2m)d²ψ/dx² + Uψ = Eψ",
    summary: "Momentum, wave, and energy ideas meet in a governing equation for matter-wave behavior.",
    details:
      "This is beyond IB scope, but it is the natural continuation of de Broglie and standing-wave reasoning.",
    assumptions: ["Non-relativistic quantum system in the displayed form"],
    commonMistakes: ["Reading ψ as a literal material wave height rather than a quantum state function."],
    ibUse: ["Bridge only", "Explaining why de Broglie is not the end of the story"],
    enabling: ["Wave curvature, energy structure, and momentum relations can be encoded mathematically in one equation."],
  },
  {
    id: "uncertainty",
    label: "Uncertainty Principle",
    kind: "limit",
    stage: "Limits & Extensions",
    domain: "Waves & Modern",
    level: "University Bridge",
    slot: 1,
    formula: "ΔxΔp ≥ ħ/2",
    summary: "Microscopic description has an intrinsic limit: position and momentum cannot both be made arbitrarily sharp.",
    details:
      "This is not a measurement-flaw statement but a structural fact about quantum states.",
    assumptions: ["Quantum state description"],
    commonMistakes: ["Treating uncertainty as mere experimental badness.", "Thinking it comes only from disturbance by measurement."],
    ibUse: ["Nature of science / model limits", "University bridge"],
    enabling: ["Wave localization requires combining many wavelengths/momenta."],
  },

  // Thermal
  {
    id: "thermaldefs",
    label: "Thermal Variables",
    kind: "definition",
    stage: "Definitions",
    domain: "Thermal",
    level: "IB Core",
    slot: 0,
    formula: "T, U, Q, W",
    summary: "Thermal physics tracks internal energy, heat transfer, work, and temperature.",
    details:
      "This row exists to show that thermodynamics fits into the same structure: definitions → law → applications → limits.",
    units: ["T: K", "U,Q,W: J"],
    assumptions: ["A system boundary is specified."],
    commonMistakes: ["Treating heat as a property stored in a body instead of energy in transfer.", "Mixing temperature with internal energy."],
    ibUse: ["Calorimetry", "Sign conventions", "Process reasoning"],
    enabling: ["A system can exchange energy in different modes while its state changes."],
  },
  {
    id: "firstlaw",
    label: "First Law of Thermodynamics",
    kind: "law",
    stage: "Laws",
    domain: "Thermal",
    level: "IB Core",
    slot: 0,
    formula: "ΔU = Q - W   (with work done by the system)",
    summary: "The first law is energy conservation specialized to thermodynamic systems.",
    details:
      "This is one of the most useful examples of a general principle being rewritten in a domain-specific language.",
    units: ["J"],
    assumptions: ["A sign convention has been chosen and kept consistent."],
    commonMistakes: ["Switching sign conventions mid-solution.", "Confusing heat with temperature change directly."],
    ibUse: ["Process analysis", "Cyclic processes", "Qualitative thermodynamic reasoning"],
    enabling: ["Energy conservation still holds, but the bookkeeping categories are heat and work rather than just kinetic/potential terms."],
    bridgeNote:
      "This node broadens the map beyond mechanics and waves while preserving the same logic skeleton.",
  },
];

const edges = [
  // Mechanics structure
  { id: "e1", source: "motiondefs", target: "newton2", relation: "feeds into", explanation: "Acceleration definitions give Newton's 2nd law its operational meaning." },
  { id: "e2", source: "momentumdef", target: "newton2", relation: "appears in", explanation: "The most general form of Newton's 2nd law uses momentum, not acceleration directly." },
  { id: "e3", source: "newton2", target: "impulse", relation: "integrates to", explanation: "Integrating F = dp/dt over time gives impulse and momentum change." },
  { id: "e4", source: "motiondefs", target: "suvat", relation: "derives into", explanation: "The SUVAT equations come from the definitions of velocity and acceleration plus the constant-acceleration assumption." },
  { id: "e5", source: "workenergy", target: "escape", relation: "applies to", explanation: "Escape speed is a direct application of energy conservation / work-energy methods in gravity." },
  { id: "e6", source: "suvat", target: "projectile", relation: "applies to", explanation: "Projectile motion uses the constant-acceleration family separately in horizontal and vertical directions." },
  { id: "e7", source: "newton2", target: "relativity", relation: "limited by", explanation: "The low-speed classical form must be revised near the speed of light." },
  { id: "e8", source: "newton2", target: "shm", relation: "drives", explanation: "Combining Newton's 2nd law with a restoring force produces SHM." },
  { id: "e9", source: "workenergy", target: "suvat", relation: "complements", explanation: "Energy methods and kinematic equations often solve the same motion problem from different angles." },

  // Fields & Electricity structure
  { id: "e10", source: "fielddefs", target: "fieldpotentiallaw", relation: "becomes", explanation: "Field and potential definitions combine into a derivative relation at bridge level." },
  { id: "e11", source: "fielddefs", target: "potentialenergy", relation: "supports", explanation: "Potential-energy reasoning is the energy-side version of field reasoning for conservative interactions." },
  { id: "e12", source: "circuitdefs", target: "capacitors", relation: "extends to", explanation: "Capacitor energy makes sense only after current, charge, and voltage are conceptually grounded." },
  { id: "e13", source: "circuitdefs", target: "circuits", relation: "applies in", explanation: "The basic circuit quantities become measurable relationships in actual networks." },
  { id: "e14", source: "fieldpotentiallaw", target: "gauss", relation: "extends to", explanation: "Gauss's law is a more global field statement that becomes powerful with symmetry." },
  { id: "e15", source: "magneticforce", target: "circuits", relation: "appears in", explanation: "Magnetic force laws underlie motors and current-carrying conductor effects." },
  { id: "e16", source: "potentialenergy", target: "capacitors", relation: "parallels", explanation: "Both are examples of storing energy in a configuration / field rather than as motion." },

  // Waves & Modern structure
  { id: "e17", source: "wavedefs", target: "waverelation", relation: "combine into", explanation: "The wave relation is built directly from period, frequency, and wavelength definitions." },
  { id: "e18", source: "quantumdefs", target: "debroglie", relation: "motivates", explanation: "The wave–particle bridge invites the matter-wavelength relation." },
  { id: "e19", source: "waverelation", target: "standingwaves", relation: "helps derive", explanation: "Standing-wave patterns use wavelength structure under boundary constraints." },
  { id: "e20", source: "standingwaves", target: "interference", relation: "depends on", explanation: "Standing waves are an organized consequence of superposition and interference." },
  { id: "e21", source: "debroglie", target: "photoelectric", relation: "sits beside", explanation: "de Broglie and photoelectricity are parallel pillars of the quantum transition: matter waves and light quanta." },
  { id: "e22", source: "debroglie", target: "schrodinger", relation: "leads toward", explanation: "Once matter has wavelength, the next question is what wave equation matter obeys." },
  { id: "e23", source: "shm", target: "standingwaves", relation: "builds into", explanation: "Wave motion can be treated as many local oscillators; SHM is the local oscillator model." },
  { id: "e24", source: "schrodinger", target: "uncertainty", relation: "implies structure behind", explanation: "Quantum state structure leads naturally to limits on simultaneous sharpness of conjugate variables." },
  { id: "e25", source: "interference", target: "uncertainty", relation: "hints at", explanation: "Wave spreading and superposition already suggest tradeoffs between localization and momentum purity." },

  // Thermal structure
  { id: "e26", source: "thermaldefs", target: "firstlaw", relation: "organized by", explanation: "The first law turns basic thermal quantities into a conservation statement for a system." },

  // Cross-domain bridges
  { id: "e27", source: "momentumdef", target: "debroglie", relation: "bridges to", explanation: "Momentum becomes the classical quantity that determines matter wavelength." },
  { id: "e28", source: "workenergy", target: "firstlaw", relation: "generalizes into", explanation: "The first law is energy conservation expressed in thermodynamic bookkeeping language." },
  { id: "e29", source: "motiondefs", target: "waverelation", relation: "echoes", explanation: "Both use the same rate-and-cycle logic: distance over time from a repeating structure." },
  { id: "e30", source: "fielddefs", target: "escape", relation: "analogous energy view", explanation: "Escape speed also depends on reading gravity as a potential-energy landscape, not just as a force." },
];

const kindStyle = {
  definition: { fill: "#dbeafe" },
  law: { fill: "#fef3c7" },
  derivation: { fill: "#d1fae5" },
  application: { fill: "#ede9fe" },
  limit: { fill: "#fee2e2" },
};

const areaFilters = ["All", ...DOMAINS];
const stageFilters = ["All", ...STAGES];
const levelFilters = ["All", "IB Core", "University Bridge"];

function matchesQuery(node, query) {
  if (!query.trim()) return true;
  const haystack = [
    node.label,
    node.kind,
    node.stage,
    node.domain,
    node.level,
    node.formula || "",
    node.summary || "",
    node.details || "",
    ...(node.derivation || []),
    ...(node.enabling || []),
    ...(node.units || []),
    ...(node.assumptions || []),
    ...(node.commonMistakes || []),
    ...(node.ibUse || []),
    node.bridgeNote || "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function Section({ title, items, mono = false, defaultOpen = true }) {
  if (!items || items.length === 0) return null;
  return (
    <details open={defaultOpen} className="rounded-2xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">{title}</summary>
      <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item, index) => (
          <div key={index} className={`rounded-xl bg-slate-50 px-3 py-2 ${mono ? "font-mono text-[13px]" : ""}`}>
            {item}
          </div>
        ))}
      </div>
    </details>
  );
}

export default function PhysicsConceptMap() {
  const [selectedNodeId, setSelectedNodeId] = useState("suvat");
  const [selectedEdgeId, setSelectedEdgeId] = useState("e4");
  const [areaFilter, setAreaFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);

  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      const areaOk = areaFilter === "All" || node.domain === areaFilter;
      const stageOk = stageFilter === "All" || node.stage === stageFilter;
      const levelOk = levelFilter === "All" || node.level === levelFilter;
      const queryOk = matchesQuery(node, query);
      return areaOk && stageOk && levelOk && queryOk;
    });
  }, [areaFilter, stageFilter, levelFilter, query]);

  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = useMemo(
    () => edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)),
    [visibleNodeIds]
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || visibleNodes[0] || nodes[0];
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId) || visibleEdges[0] || edges[0];

  const neighborIds = useMemo(() => {
    const ids = new Set([selectedNode?.id]);
    edges.forEach((edge) => {
      if (edge.source === selectedNode?.id) ids.add(edge.target);
      if (edge.target === selectedNode?.id) ids.add(edge.source);
    });
    return ids;
  }, [selectedNode]);

  const routes = [
    {
      title: "Mechanics logic chain",
      body: "Definitions of motion and momentum → Newton's 2nd law → impulse / work-energy derivations → projectile motion and escape velocity → relativity limit.",
    },
    {
      title: "Field logic chain",
      body: "Field and potential definitions → field–potential law → potential-energy and capacitor derivations → circuit applications → Gauss's-law extension.",
    },
    {
      title: "Wave-to-quantum chain",
      body: "Wave quantities → wave relation → standing-wave and SHM derivations → interference and photoelectric applications → Schrödinger and uncertainty limits.",
    },
    {
      title: "Thermal logic chain",
      body: "Thermal variables → first law → process reasoning. Same skeleton, different domain language.",
    },
  ].filter((r) => (!query.trim() ? true : `${r.title} ${r.body}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <div className="mx-auto max-w-[1700px] space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Physics Knowledge Map — Structured IB to University Bridge</h1>
              <p className="mt-1 text-sm text-slate-600">
                Reorganized as <span className="font-medium">definitions → laws → derivations → applications → limits</span>, with expandable node notes for assumptions, units, common mistakes, and IB exam uses.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Domain</div>
                <div className="flex flex-wrap gap-2">
                  {areaFilters.map((item) => (
                    <Button key={item} variant={areaFilter === item ? "default" : "outline"} className="rounded-2xl" onClick={() => setAreaFilter(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Stage</div>
                <div className="flex flex-wrap gap-2">
                  {stageFilters.map((item) => (
                    <Button key={item} variant={stageFilter === item ? "default" : "outline"} className="rounded-2xl" onClick={() => setStageFilter(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Level</div>
                <div className="flex flex-wrap gap-2">
                  {levelFilters.map((item) => (
                    <Button key={item} variant={levelFilter === item ? "default" : "outline"} className="rounded-2xl" onClick={() => setLevelFilter(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search formulas, assumptions, mistakes, derivation steps, or exam uses..."
                className="rounded-2xl"
              />
              <Button variant="outline" className="rounded-2xl" onClick={() => setShowLabels((s) => !s)}>
                {showLabels ? "Hide relation labels" : "Show relation labels"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto bg-white">
                  <svg viewBox="0 0 1400 1080" className="h-[920px] w-full min-w-[1260px]">
                    <rect x="0" y="0" width="1400" height="1080" fill="#f8fafc" />

                    {STAGES.map((stage, index) => (
                      <g key={stage}>
                        <rect x={70 + index * 260} y={32} width={220} height={980} rx={28} fill="#ffffff" stroke="#e2e8f0" />
                        <text x={180 + index * 260} y={72} textAnchor="middle" className="fill-slate-900 text-[16px] font-semibold">
                          {stage}
                        </text>
                      </g>
                    ))}

                    {DOMAINS.map((domain, idx) => (
                      <g key={domain}>
                        <rect x={20} y={110 + idx * 250} width={42} height={170} rx={18} fill="#0f172a" opacity="0.95" />
                        <text transform={`translate(41 ${195 + idx * 250}) rotate(-90)`} textAnchor="middle" className="fill-white text-[13px] font-semibold">
                          {domain}
                        </text>
                      </g>
                    ))}

                    {visibleEdges.map((edge) => {
                      const sourceNode = nodes.find((n) => n.id === edge.source);
                      const targetNode = nodes.find((n) => n.id === edge.target);
                      const source = pos(sourceNode.stage, sourceNode.domain, sourceNode.slot);
                      const target = pos(targetNode.stage, targetNode.domain, targetNode.slot);
                      const midX = (source.x + target.x) / 2;
                      const midY = (source.y + target.y) / 2;
                      const isSelected = selectedEdge?.id === edge.id;
                      return (
                        <g key={edge.id}>
                          <line
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={isSelected ? "#0f172a" : "#94a3b8"}
                            strokeWidth={isSelected ? 4 : 2.2}
                            opacity={isSelected ? 1 : 0.74}
                          />
                          <line
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke="transparent"
                            strokeWidth={18}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedEdgeId(edge.id);
                              setSelectedNodeId(edge.source);
                            }}
                          />
                          {showLabels && (
                            <g transform={`translate(${midX}, ${midY})`}>
                              <rect x={-48} y={-12} width={96} height={24} rx={10} fill="white" opacity={0.93} />
                              <text textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-[11px] font-medium">
                                {edge.relation}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {visibleNodes.map((node) => {
                      const { x, y } = pos(node.stage, node.domain, node.slot);
                      const width = 170;
                      const height = 60;
                      const isSelected = selectedNode?.id === node.id;
                      const isNeighbor = neighborIds.has(node.id);
                      return (
                        <g
                          key={node.id}
                          transform={`translate(${x - width / 2}, ${y - height / 2})`}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            setSelectedEdgeId("");
                          }}
                          style={{ opacity: selectedNode ? (isNeighbor ? 1 : 0.52) : 1 }}
                        >
                          <rect width={width} height={height} rx={18} fill={kindStyle[node.kind].fill} stroke={isSelected ? "#0f172a" : "#cbd5e1"} strokeWidth={isSelected ? 2.6 : 1.5} />
                          <text x={width / 2} y={21} textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">
                            {node.label}
                          </text>
                          <text x={width / 2} y={39} textAnchor="middle" className="fill-slate-500 text-[11px]">
                            {node.kind} · {node.level}
                          </text>
                          <text x={width / 2} y={52} textAnchor="middle" className="fill-slate-400 text-[10px]">
                            {node.domain}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <motion.div layout>
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Node</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{selectedNode.label}</h2>
                        <p className="text-sm text-slate-500">
                          {selectedNode.domain} · {selectedNode.stage} · {selectedNode.kind} · {selectedNode.level}
                        </p>
                      </div>
                      <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">{selectedNode.stage}</div>
                    </div>
                    {selectedNode.formula && (
                      <div className="rounded-xl bg-white px-3 py-2 font-mono text-sm text-slate-800 ring-1 ring-slate-200">
                        {selectedNode.formula}
                      </div>
                    )}
                    <p className="mt-3 text-sm leading-6 text-slate-700">{selectedNode.summary}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{selectedNode.details}</p>
                    {selectedNode.bridgeNote && (
                      <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm leading-6 text-slate-800 ring-1 ring-amber-200">
                        <span className="font-semibold">Bridge note:</span> {selectedNode.bridgeNote}
                      </div>
                    )}
                  </div>

                  <Section title="Algebraic derivation" items={selectedNode.derivation} />
                  <Section title="What makes it possible conceptually" items={selectedNode.enabling} />
                  <Section title="Units" items={selectedNode.units} mono />
                  <Section title="Assumptions" items={selectedNode.assumptions} />
                  <Section title="Common mistakes" items={selectedNode.commonMistakes} />
                  <Section title="Typical IB exam uses" items={selectedNode.ibUse} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div layout>
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Relation</div>
                    <div className="mb-3 text-lg font-semibold text-slate-900">{selectedEdge.relation}</div>
                    <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200">
                      {nodes.find((n) => n.id === selectedEdge.source)?.label} → {nodes.find((n) => n.id === selectedEdge.target)?.label}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{selectedEdge.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Map reading guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-slate-700">
                {routes.map((route) => (
                  <div key={route.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-semibold text-slate-900">{route.title}</div>
                    <div className="mt-1">{route.body}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
