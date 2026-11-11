# Quantinuum Guppy Playpond — Quantum Social Prescribing 4-Qubit VQC (`QSPMLM`)
# Run in browser at: https://play.guppylang.org/?simulator=Quest
from guppylang import guppy
from guppylang.std.angles import pi
from guppylang.std.quantum import cx, cz, measure, qubit, rx, ry, rz
from guppylang.std.builtins import result

@guppy
def main() -> None:
    q0, q1, q2, q3 = qubit(), qubit(), qubit(), qubit()
    # Encode Core20PLUS5 + Pharmacy SMR + Psychoneuroimmunology patient profile
    ry(q0, 0.68 * pi)
    rz(q0, 0.84 * pi)
    rx(q0, 0.57 * pi)
    ry(q1, 0.62 * pi)
    rz(q1, 0.32 * pi)
    ry(q2, 0.42 * pi)
    rz(q2, 0.66 * pi)
    ry(q3, 0.64 * pi)
    rz(q3, 0.72 * pi)
    # DisCoPy Frobenius neighbourhood ring + cross-dyad interference
    cx(q0, q1)
    cx(q1, q2)
    cx(q2, q3)
    cx(q3, q0)
    cz(q0, q2)
    cz(q1, q3)
    result("q0_loneliness_acb", measure(q0).read())
    result("q1_imd_housing", measure(q1).read())
    result("q2_zeitgeber_hpa", measure(q2).read())
    result("q3_il6_mobility", measure(q3).read())
