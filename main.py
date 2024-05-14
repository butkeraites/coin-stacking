import math


def calculate_CSA(radius: float, height: float, **kwargs) -> float:
    """
    CSA stands for cylinder surface area
    """
    return 2 * math.pi * (radius + height)


def calculate_OCSA(radius: float, height: float, angle: float, **kwargs) -> float:
    """
    CSA stands for oblique cylinder surface area
    """
    return (
        2 * math.pi * (radius + height / math.sin(angle))
        if angle % math.pi != 0
        else None
    )


def calculate_CSSA(
    radius: float, height: float, angle: float, number_of_coins: int
) -> float:
    """
    CSSA stands for coin stack surface area
    """

    def lune_area(radius: float, distance_between_centers: float) -> float:
        return 1 / 2 * math.sqrt(
            4 * radius**2 + distance_between_centers**4
        ) + 2 * radius**2 * math.asin(distance_between_centers / (2 * radius))

    distance_between_centers = (
        (height / number_of_coins) * (1 / math.tan(angle))
        if math.tan(angle) != 0
        else None
    )

    return (
        2
        * math.pi
        * (
            radius
            + height
            + 2
            * sum(
                [
                    lune_area(radius, distance_between_centers)
                    for coin_level in range(number_of_coins - 2)
                ]
            )
        )
        if angle % math.pi != 0
        else None
    )


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
