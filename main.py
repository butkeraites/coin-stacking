import math

# sin(angle) is treated as zero within this tolerance, since floating-point
# math.sin(math.pi) is ~1e-16 rather than exactly 0.
_DEGENERATE_SIN = 1e-9


def calculate_CSA(radius: float, height: float, **kwargs) -> float:
    """
    CSA stands for cylinder surface area.

    Total surface area of a right cylinder: the two circular end caps
    plus the lateral wall -> 2*pi*r*(r + h).
    """
    return 2 * math.pi * radius * (radius + height)


def calculate_OCSA(radius: float, height: float, angle: float, **kwargs):
    """
    OCSA stands for oblique cylinder surface area.

    The cylinder is sheared so its axis is tilted `angle` radians from the
    base plane; the slanted axis therefore has length h / sin(angle).
    Returns None for degenerate angles where sin(angle) == 0.
    """
    sin_a = math.sin(angle)
    if abs(sin_a) < _DEGENERATE_SIN:
        return None
    return 2 * math.pi * radius * (radius + height / abs(sin_a))


def calculate_CSSA(
    radius: float, height: float, angle: float, number_of_coins: int
):
    """
    CSSA stands for coin stack surface area.

    Models a stack of `number_of_coins` identical coins, each a cylinder of
    radius `radius` and sub-height height / number_of_coins, sheared so the
    stack leans `angle` radians from the base plane. The exposed surface is:

      * the lateral wall of every coin:   2*pi*r * h / sin(angle)
      * the two outer end caps:           2 * pi*r**2
      * the exposed crescent (lune) of
        each interior face:               2 * (n - 1) lunes

    Returns None for degenerate angles where sin(angle) == 0.
    """

    def lune_area(radius: float, distance_between_centers: float) -> float:
        """
        Exposed crescent area of a coin face partially covered by an
        equal-radius neighbour whose centre is `distance_between_centers`
        away: the full disc minus the circular lens of overlap.
        """
        d = abs(distance_between_centers)
        full_disc = math.pi * radius**2
        if d >= 2 * radius:
            return full_disc
        lens = 2 * radius**2 * math.acos(d / (2 * radius)) - (d / 2) * math.sqrt(
            4 * radius**2 - d**2
        )
        return full_disc - lens

    sin_a = math.sin(angle)
    if abs(sin_a) < _DEGENERATE_SIN or number_of_coins < 1:
        return None

    lateral = 2 * math.pi * radius * (height / abs(sin_a))
    caps = 2 * math.pi * radius**2

    if number_of_coins == 1:
        return lateral + caps

    distance_between_centers = (height / number_of_coins) / math.tan(angle)
    interior = 2 * (number_of_coins - 1) * lune_area(
        radius, distance_between_centers
    )
    return lateral + caps + interior


if __name__ == "__main__":
    test_cases = [
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 3, "number_of_coins": 1},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 3, "number_of_coins": 5},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 3, "number_of_coins": 10},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 4, "number_of_coins": 1},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 4, "number_of_coins": 5},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 4, "number_of_coins": 10},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 6, "number_of_coins": 1},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 6, "number_of_coins": 5},
        {"radius": 1.0, "height": 1.0, "angle": math.pi / 6, "number_of_coins": 10},
    ]

    for number, test in enumerate(test_cases):
        csa = calculate_CSA(**test)
        ocsa = calculate_OCSA(**test)
        cssa = calculate_CSSA(**test)
        print(f"{number}:{csa}, {ocsa}, {cssa}")
