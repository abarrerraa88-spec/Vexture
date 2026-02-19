"""Color utilities for Vexture."""


def hex_to_rgba(value: str) -> tuple[int, int, int, int]:
    """Convert CSS-style hex colors to an (r, g, b, a) tuple.

    Supports #RGB, #RGBA, #RRGGBB, and #RRGGBBAA.
    """
    text = value.strip()
    if text.startswith("#"):
        text = text[1:]

    if len(text) == 3:
        r, g, b = (int(ch * 2, 16) for ch in text)
        return (r, g, b, 255)

    if len(text) == 4:
        r, g, b, a = (int(ch * 2, 16) for ch in text)
        return (r, g, b, a)

    if len(text) == 6:
        r = int(text[0:2], 16)
        g = int(text[2:4], 16)
        b = int(text[4:6], 16)
        return (r, g, b, 255)

    if len(text) == 8:
        r = int(text[0:2], 16)
        g = int(text[2:4], 16)
        b = int(text[4:6], 16)
        a = int(text[6:8], 16)
        return (r, g, b, a)

    raise ValueError(f"Unsupported hex color length: {len(text)}")
